import { DragEvent, FormEvent, KeyboardEvent, useState } from "react";
import { BoardCard, BoardColumn, ColumnTone, IHomeUIHookProps } from "./HomeUI.hook";

const TONE_DOT: Record<ColumnTone, string> = {
  todo: "bg-zinc-400",
  doing: "bg-violet-500",
  done: "bg-emerald-500",
};

const GripIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <circle cx="4" cy="3" r="1.1" fill="currentColor" />
    <circle cx="10" cy="3" r="1.1" fill="currentColor" />
    <circle cx="4" cy="7" r="1.1" fill="currentColor" />
    <circle cx="10" cy="7" r="1.1" fill="currentColor" />
    <circle cx="4" cy="11" r="1.1" fill="currentColor" />
    <circle cx="10" cy="11" r="1.1" fill="currentColor" />
  </svg>
);

type TaskCardProps = {
  card: BoardCard;
  isDragging: boolean;
  insertBefore: boolean;
  insertAfter: boolean;
  onDragStart: (event: DragEvent<HTMLElement>, cardId: string) => void;
  onDragEnd: () => void;
  onRename: (cardId: string, title: string) => void;
  onDelete: (cardId: string) => void;
};

const TaskCard = ({
  card,
  isDragging,
  insertBefore,
  insertAfter,
  onDragStart,
  onDragEnd,
  onRename,
  onDelete,
}: TaskCardProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(card.title);

  const startEdit = () => {
    setDraft(card.title);
    setEditing(true);
  };

  const commit = () => {
    onRename(card.id, draft);
    setEditing(false);
  };

  const shadow = insertBefore
    ? "shadow-[inset_0_3px_0_0_#7c3aed]"
    : insertAfter
      ? "shadow-[inset_0_-3px_0_0_#7c3aed]"
      : "shadow-sm";

  return (
    <article
      data-card-id={card.id}
      draggable={!editing}
      onDragStart={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("[data-no-drag]")) {
          event.preventDefault();
          return;
        }
        onDragStart(event, card.id);
      }}
      onDragEnd={onDragEnd}
      className={`group cursor-grab rounded-lg border border-zinc-200/80 bg-white px-3 py-2.5 select-none active:cursor-grabbing ${shadow} ${isDragging ? "opacity-40" : ""}`}
    >
      {editing ? (
        <input
          autoFocus
          data-no-drag
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
            if (event.key === "Escape") setEditing(false);
          }}
          className="w-full rounded bg-zinc-50 px-1 py-0.5 text-sm text-zinc-900 outline-none ring-1 ring-violet-400 select-text"
          aria-label="Editar tarjeta"
        />
      ) : (
        <div className="flex items-start gap-2">
          <p className="min-w-0 flex-1 text-sm font-medium text-zinc-900" onDoubleClick={startEdit}>
            {card.title}
          </p>
          <button
            type="button"
            data-no-drag
            onClick={startEdit}
            className="shrink-0 rounded px-1 text-[11px] text-zinc-400 opacity-0 hover:bg-zinc-100 hover:text-zinc-700 group-hover:opacity-100"
          >
            Editar
          </button>
          <button
            type="button"
            data-no-drag
            onClick={() => onDelete(card.id)}
            className="shrink-0 rounded px-1 text-xs text-zinc-400 opacity-0 hover:bg-zinc-100 hover:text-zinc-700 group-hover:opacity-100"
            aria-label={`Eliminar ${card.title}`}
          >
            ×
          </button>
        </div>
      )}
    </article>
  );
};

type ColumnProps = {
  column: BoardColumn;
  cards: Record<string, BoardCard>;
  activeCardId: string | null;
  cardDropIndex: number | null;
  isColumnTarget: boolean;
  onShellDragOver: (event: DragEvent<HTMLElement>, columnId: string) => void;
  onShellDrop: (event: DragEvent<HTMLElement>, columnId: string) => void;
  onCardDragStart: (event: DragEvent<HTMLElement>, cardId: string) => void;
  onColumnDragStart: (event: DragEvent<HTMLElement>, columnId: string) => void;
  onDragEnd: () => void;
  onAddCard: (columnId: string, title: string) => void;
  onRenameCard: (cardId: string, title: string) => void;
  onDeleteCard: (cardId: string) => void;
  onRenameColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
};

const BoardColumnView = ({
  column,
  cards,
  activeCardId,
  cardDropIndex,
  isColumnTarget,
  onShellDragOver,
  onShellDrop,
  onCardDragStart,
  onColumnDragStart,
  onDragEnd,
  onAddCard,
  onRenameCard,
  onDeleteCard,
  onRenameColumn,
  onDeleteColumn,
}: ColumnProps) => {
  return (
    <section
      onDragOver={(event) => onShellDragOver(event, column.id)}
      onDrop={(event) => onShellDrop(event, column.id)}
      className={`flex h-full w-[280px] shrink-0 flex-col rounded-xl bg-[#eceef1] ${isColumnTarget ? "outline outline-2 outline-violet-500" : ""}`}
    >
      <header className="flex shrink-0 items-center gap-2 px-3 py-3">
        <button
          type="button"
          draggable
          onDragStart={(event) => onColumnDragStart(event, column.id)}
          onDragEnd={onDragEnd}
          className="cursor-grab text-zinc-400 active:cursor-grabbing"
          aria-label={`Mover columna ${column.title}`}
        >
          <GripIcon />
        </button>
        <span className={`h-2.5 w-2.5 shrink-0 rounded-sm ${TONE_DOT[column.tone]}`} />
        <input
          value={column.title}
          onChange={(event) => onRenameColumn(column.id, event.target.value)}
          onBlur={(event) => {
            const next = event.target.value.trim() || "Sin título";
            if (next !== column.title) onRenameColumn(column.id, next);
          }}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none"
          aria-label="Nombre de la columna"
        />
        <span className="rounded-full bg-white px-1.5 text-[11px] font-medium text-zinc-500">{column.cardIds.length}</span>
        <button
          type="button"
          onClick={() => onDeleteColumn(column.id)}
          className="rounded px-1 text-sm leading-none text-zinc-400 hover:bg-white hover:text-zinc-700"
          aria-label={`Eliminar columna ${column.title}`}
        >
          ×
        </button>
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2">
        {column.cardIds.length === 0 ? (
          <div
            className={`rounded-lg border border-dashed px-3 py-8 text-center text-xs ${
              cardDropIndex === 0 ? "border-violet-500 bg-violet-50 text-violet-600" : "border-zinc-300 text-zinc-400"
            }`}
          >
            {cardDropIndex === 0 ? "Suelta una tarjeta aquí" : "Sin tareas"}
          </div>
        ) : (
          column.cardIds.map((cardId, index) => {
            const card = cards[cardId];
            if (!card) return null;
            return (
              <TaskCard
                key={card.id}
                card={card}
                isDragging={activeCardId === card.id}
                insertBefore={cardDropIndex === index}
                insertAfter={cardDropIndex === column.cardIds.length && index === column.cardIds.length - 1}
                onDragStart={onCardDragStart}
                onDragEnd={onDragEnd}
                onRename={onRenameCard}
                onDelete={onDeleteCard}
              />
            );
          })
        )}
      </div>
      <CardComposer onAdd={(title) => onAddCard(column.id, title)} />
    </section>
  );
};

const CardComposer = ({ onAdd }: { onAdd: (title: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const close = () => {
    setTitle("");
    setOpen(false);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = title.trim();
    if (!next) return;
    onAdd(next);
    setTitle("");
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-2 mb-2 shrink-0 rounded-lg px-2 py-2 text-left text-sm text-zinc-500 hover:bg-white hover:text-zinc-800"
      >
        + Agregar tarea
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mx-2 mb-2 shrink-0 rounded-lg bg-white p-2 shadow-sm">
      <input
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Escape") close();
        }}
        placeholder="Nombre de la tarea"
        className="w-full rounded px-1 py-1 text-sm text-zinc-900 outline-none"
        aria-label="Nombre de la tarea"
      />
      <div className="mt-2 flex items-center gap-2">
        <button type="submit" className="rounded-md bg-violet-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-violet-700">
          Agregar
        </button>
        <button type="button" onClick={close} className="rounded-md px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100">
          Cancelar
        </button>
      </div>
    </form>
  );
};

const NewColumn = ({ onAdd }: { onAdd: (title: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const close = () => {
    setTitle("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-fit w-[280px] shrink-0 rounded-xl bg-[#eceef1] px-3 py-3 text-left text-sm font-medium text-zinc-600 hover:bg-[#e4e6ea]"
      >
        + Nueva columna
      </button>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const next = title.trim();
        if (!next) return;
        onAdd(next);
        close();
      }}
      className="w-[280px] shrink-0 rounded-xl bg-[#eceef1] p-3"
    >
      <input
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Escape") close();
        }}
        placeholder="Nombre de la columna"
        className="w-full rounded-md bg-white px-2 py-1.5 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200"
        aria-label="Nombre de la columna"
      />
      <div className="mt-2 flex items-center gap-2">
        <button type="submit" className="rounded-md bg-violet-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-violet-700">
          Agregar
        </button>
        <button type="button" onClick={close} className="rounded-md px-2 py-1 text-xs text-zinc-500 hover:bg-white">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export const HomeUIView = ({
  columns,
  cards,
  activeDrag,
  cardDrop,
  columnDropId,
  onShellDragOver,
  onShellDrop,
  onCardDragStart,
  onColumnDragStart,
  onDragEnd,
  addCard,
  renameCard,
  deleteCard,
  addColumn,
  renameColumn,
  deleteColumn,
}: IHomeUIHookProps) => {
  return (
    <div className="flex h-[calc(100dvh-96px)] min-h-[520px] flex-col overflow-hidden rounded-xl bg-[#f4f5f7] p-4">
      <div className="mb-4 shrink-0">
        <h1 className="text-lg font-semibold text-zinc-900">Tablero</h1>
        <p className="mt-1 text-xs text-zinc-500">
          Arrastra una tarjeta para ordenarla o moverla de columna. El punto mueve la columna. Pasa el cursor para editar o eliminar.
        </p>
      </div>
      <div className="flex min-h-0 flex-1 items-stretch gap-3 overflow-x-auto pb-1">
        {columns.map((column) => (
          <BoardColumnView
            key={column.id}
            column={column}
            cards={cards}
            activeCardId={activeDrag?.kind === "card" ? activeDrag.id : null}
            cardDropIndex={cardDrop?.columnId === column.id ? cardDrop.index : null}
            isColumnTarget={columnDropId === column.id && activeDrag?.kind === "column"}
            onShellDragOver={onShellDragOver}
            onShellDrop={onShellDrop}
            onCardDragStart={onCardDragStart}
            onColumnDragStart={onColumnDragStart}
            onDragEnd={onDragEnd}
            onAddCard={addCard}
            onRenameCard={renameCard}
            onDeleteCard={deleteCard}
            onRenameColumn={renameColumn}
            onDeleteColumn={deleteColumn}
          />
        ))}
        <NewColumn onAdd={addColumn} />
      </div>
    </div>
  );
};
