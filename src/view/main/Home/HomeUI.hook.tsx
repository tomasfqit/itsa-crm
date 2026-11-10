import { DragEvent, useCallback, useRef, useState } from "react";

export type ColumnTone = "todo" | "doing" | "done";

export type BoardCard = {
  id: string;
  title: string;
};

export type BoardColumn = {
  id: string;
  title: string;
  tone: ColumnTone;
  cardIds: string[];
};

export type ActiveDrag = {
  kind: "card" | "column";
  id: string;
};

export type CardDropTarget = {
  columnId: string;
  index: number;
};

type BoardState = {
  columns: BoardColumn[];
  cards: Record<string, BoardCard>;
};

const TONES: ColumnTone[] = ["todo", "doing", "done"];

const initialBoard: BoardState = {
  cards: {
    "card-1": { id: "card-1", title: "Ir a casa" },
    "card-2": { id: "card-2", title: "Ducharse" },
    "card-3": { id: "card-3", title: "Revisar el correo" },
    "card-4": { id: "card-4", title: "Levantarse" },
    "card-5": { id: "card-5", title: "Cepillarse los dientes" },
    "card-6": { id: "card-6", title: "Dormirse" },
    "card-7": { id: "card-7", title: "Ir al trabajo" },
    "card-8": { id: "card-8", title: "Comprar víveres" },
    "card-9": { id: "card-9", title: "Pasear al perro" },
  },
  columns: [
    {
      id: "col-todo",
      title: "Por hacer",
      tone: "todo",
      cardIds: ["card-1", "card-2", "card-3", "card-4", "card-5", "card-6", "card-7", "card-8"],
    },
    { id: "col-doing", title: "En progreso", tone: "doing", cardIds: [] },
    { id: "col-done", title: "Hecho", tone: "done", cardIds: ["card-9"] },
  ],
};

const indexFromPointer = (container: HTMLElement, clientY: number) => {
  const cards = container.querySelectorAll<HTMLElement>("[data-card-id]");
  for (let index = 0; index < cards.length; index += 1) {
    const rect = cards[index].getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) return index;
  }
  return cards.length;
};

const moveCard = (board: BoardState, cardId: string, toColumnId: string, toIndex: number): BoardState => {
  const fromColumn = board.columns.find((column) => column.cardIds.includes(cardId));
  const toColumn = board.columns.find((column) => column.id === toColumnId);
  if (!fromColumn || !toColumn) return board;

  const fromIndex = fromColumn.cardIds.indexOf(cardId);
  const sameColumn = fromColumn.id === toColumn.id;
  let index = toIndex;
  if (sameColumn && fromIndex < index) index -= 1;

  const maxIndex = sameColumn ? fromColumn.cardIds.length - 1 : toColumn.cardIds.length;
  index = Math.max(0, Math.min(index, maxIndex));
  if (sameColumn && fromIndex === index) return board;

  return {
    ...board,
    columns: board.columns.map((column) => {
      if (column.id === fromColumn.id && column.id === toColumn.id) {
        const cardIds = column.cardIds.filter((id) => id !== cardId);
        cardIds.splice(index, 0, cardId);
        return { ...column, cardIds };
      }
      if (column.id === fromColumn.id) {
        return { ...column, cardIds: column.cardIds.filter((id) => id !== cardId) };
      }
      if (column.id === toColumn.id) {
        const cardIds = [...column.cardIds];
        cardIds.splice(index, 0, cardId);
        return { ...column, cardIds };
      }
      return column;
    }),
  };
};

const moveColumn = (board: BoardState, columnId: string, toColumnId: string): BoardState => {
  const fromIndex = board.columns.findIndex((column) => column.id === columnId);
  const toIndex = board.columns.findIndex((column) => column.id === toColumnId);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return board;

  const columns = [...board.columns];
  const [column] = columns.splice(fromIndex, 1);
  columns.splice(toIndex, 0, column);
  return { ...board, columns };
};

export interface IHomeUIHookProps {
  columns: BoardColumn[];
  cards: Record<string, BoardCard>;
  activeDrag: ActiveDrag | null;
  cardDrop: CardDropTarget | null;
  columnDropId: string | null;
  onShellDragOver: (event: DragEvent<HTMLElement>, columnId: string) => void;
  onShellDrop: (event: DragEvent<HTMLElement>, columnId: string) => void;
  onCardDragStart: (event: DragEvent<HTMLElement>, cardId: string) => void;
  onColumnDragStart: (event: DragEvent<HTMLElement>, columnId: string) => void;
  onDragEnd: () => void;
  addCard: (columnId: string, title: string) => void;
  renameCard: (cardId: string, title: string) => void;
  deleteCard: (cardId: string) => void;
  addColumn: (title: string) => void;
  renameColumn: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;
}

export const useHomeUIHook = (): IHomeUIHookProps => {
  const [board, setBoard] = useState<BoardState>(initialBoard);
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);
  const [cardDrop, setCardDrop] = useState<CardDropTarget | null>(null);
  const [columnDropId, setColumnDropId] = useState<string | null>(null);
  const boardRef = useRef(board);
  const dragRef = useRef<ActiveDrag | null>(null);
  const cardDropRef = useRef<CardDropTarget | null>(null);
  const sequence = useRef(10);

  boardRef.current = board;

  const rememberDrag = (drag: ActiveDrag | null) => {
    dragRef.current = drag;
    setActiveDrag(drag);
  };

  const rememberCardDrop = (target: CardDropTarget | null) => {
    const current = cardDropRef.current;
    if (current?.columnId === target?.columnId && current?.index === target?.index) return;
    cardDropRef.current = target;
    setCardDrop(target);
  };

  const clearDrag = useCallback(() => {
    dragRef.current = null;
    cardDropRef.current = null;
    setActiveDrag(null);
    setCardDrop(null);
    setColumnDropId(null);
  }, []);

  const nextId = (prefix: string) => {
    sequence.current += 1;
    return `${prefix}-${sequence.current}`;
  };

  const onCardDragStart = useCallback((event: DragEvent<HTMLElement>, cardId: string) => {
    event.dataTransfer.setData("text/plain", cardId);
    event.dataTransfer.effectAllowed = "move";
    rememberDrag({ kind: "card", id: cardId });
  }, []);

  const onColumnDragStart = useCallback((event: DragEvent<HTMLElement>, columnId: string) => {
    event.dataTransfer.setData("text/plain", columnId);
    event.dataTransfer.effectAllowed = "move";
    const shell = event.currentTarget.closest("section");
    if (shell) {
      try {
        event.dataTransfer.setDragImage(shell, 28, 24);
      } catch {
        // Some browsers reject a drag image taken from the dragged column.
      }
    }
    rememberDrag({ kind: "column", id: columnId });
    setCardDrop(null);
    cardDropRef.current = null;
  }, []);

  const onShellDragOver = useCallback((event: DragEvent<HTMLElement>, columnId: string) => {
    const drag = dragRef.current;
    if (!drag) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    if (drag.kind === "column") {
      setColumnDropId(drag.id === columnId ? null : columnId);
      return;
    }

    const index = indexFromPointer(event.currentTarget, event.clientY);
    const fromColumn = boardRef.current.columns.find((column) => column.cardIds.includes(drag.id));
    if (fromColumn?.id === columnId) {
      const fromIndex = fromColumn.cardIds.indexOf(drag.id);
      if (index === fromIndex || index === fromIndex + 1) {
        rememberCardDrop(null);
        return;
      }
    }
    rememberCardDrop({ columnId, index });
  }, []);

  const onShellDrop = useCallback((event: DragEvent<HTMLElement>, columnId: string) => {
    const drag = dragRef.current;
    if (!drag) return;
    event.preventDefault();

    if (drag.kind === "column") {
      setBoard((current) => moveColumn(current, drag.id, columnId));
      clearDrag();
      return;
    }

    const index = cardDropRef.current?.columnId === columnId
      ? cardDropRef.current.index
      : indexFromPointer(event.currentTarget, event.clientY);
    setBoard((current) => moveCard(current, drag.id, columnId, index));
    clearDrag();
  }, [clearDrag]);

  const addCard = useCallback((columnId: string, title: string) => {
    const nextTitle = title.trim();
    if (!nextTitle) return;
    const id = nextId("card");
    setBoard((current) => ({
      cards: { ...current.cards, [id]: { id, title: nextTitle } },
      columns: current.columns.map((column) =>
        column.id === columnId ? { ...column, cardIds: [...column.cardIds, id] } : column,
      ),
    }));
  }, []);

  const renameCard = useCallback((cardId: string, title: string) => {
    const nextTitle = title.trim();
    if (!nextTitle) return;
    setBoard((current) => {
      const card = current.cards[cardId];
      if (!card || card.title === nextTitle) return current;
      return { ...current, cards: { ...current.cards, [cardId]: { ...card, title: nextTitle } } };
    });
  }, []);

  const deleteCard = useCallback((cardId: string) => {
    setBoard((current) => {
      if (!current.cards[cardId]) return current;
      const cards = { ...current.cards };
      delete cards[cardId];
      return {
        cards,
        columns: current.columns.map((column) => ({
          ...column,
          cardIds: column.cardIds.filter((id) => id !== cardId),
        })),
      };
    });
  }, []);

  const addColumn = useCallback((title: string) => {
    const nextTitle = title.trim();
    if (!nextTitle) return;
    const id = nextId("col");
    setBoard((current) => ({
      ...current,
      columns: [
        ...current.columns,
        { id, title: nextTitle, tone: TONES[current.columns.length % TONES.length], cardIds: [] },
      ],
    }));
  }, []);

  const renameColumn = useCallback((columnId: string, title: string) => {
    setBoard((current) => ({
      ...current,
      columns: current.columns.map((column) => (column.id === columnId ? { ...column, title } : column)),
    }));
  }, []);

  const deleteColumn = useCallback((columnId: string) => {
    setBoard((current) => {
      const column = current.columns.find((item) => item.id === columnId);
      if (!column) return current;
      const cards = { ...current.cards };
      column.cardIds.forEach((cardId) => {
        delete cards[cardId];
      });
      return { cards, columns: current.columns.filter((item) => item.id !== columnId) };
    });
  }, []);

  return {
    columns: board.columns,
    cards: board.cards,
    activeDrag,
    cardDrop,
    columnDropId,
    onShellDragOver,
    onShellDrop,
    onCardDragStart,
    onColumnDragStart,
    onDragEnd: clearDrag,
    addCard,
    renameCard,
    deleteCard,
    addColumn,
    renameColumn,
    deleteColumn,
  };
};
