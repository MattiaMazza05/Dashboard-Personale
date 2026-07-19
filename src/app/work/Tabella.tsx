"use client";

import type { Selection, SortDescriptor } from "@heroui/react";

import { Avatar, Button, Checkbox, Chip, Table } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";

interface User {
  type: string;
  date: string;
  description: string;
  hours: number;
  standbyPay: number;
  receivedPay: number;
  status: "Fatto" | "Non Fatto" | "Da Fare";
}

const statusColorMap: Record<string, "success" | "danger" | "warning"> = {
  Fatto: "success",
  "Non Fatto": "danger",
  Prenotato: "warning",
};

const users: User[] = [
  {
    type: "Steward",
    date: "24/05/2026",
    description: "Palio di fucecchio",
    hours: 8,
    standbyPay: 45,
    receivedPay: 45,
    status: "Fatto",
  },
];

export function TabellaLavoro() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const col = sortDescriptor.column as keyof User;
      const first = String(a[col]);
      const second = String(b[col]);
      let cmp = first.localeCompare(second);

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });
  }, [sortDescriptor]);

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Table with custom cells"
          className="min-w-[800px]"
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <Table.Header>
            <Table.Column className="pr-0">
              <Checkbox aria-label="Select all" slot="selection">
                <Checkbox.Content>
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                </Checkbox.Content>
              </Checkbox>
            </Table.Column>
            <Table.Column
              allowsSorting
              isRowHeader
              className="after:hidden"
              id="typeActivity"
            >
              {({ sortDirection }) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Tipo Attività
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="date">
              {({ sortDirection }) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Data
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="description">
              {({ sortDirection }) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Descrizione
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="hours">
              {({ sortDirection }) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Ore
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="status">
              {({ sortDirection }) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Paga Attesa
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="standbyPay">
              {({ sortDirection }) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Paga Effettiva
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="recivedPay">
              {({ sortDirection }) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Status
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column className="text-end">Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {sortedUsers.map((user) => (
              <Table.Row key={user.type} id={user.date}>
                <Table.Cell className="pr-0">
                  <Checkbox
                    aria-label={`Select ${user.status}`}
                    slot="selection"
                    variant="secondary"
                  >
                    <Checkbox.Content>
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                    </Checkbox.Content>
                  </Checkbox>
                </Table.Cell>
                <Table.Cell className="font-medium">
                  <div className="flex items-center gap-2">{user.type} </div>
                </Table.Cell>
                <Table.Cell className="min-w-25">{user.date}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-m">{user.description}</span>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="min-w-25">{user.hours}</Table.Cell>
                <Table.Cell className="min-w-25">
                  {user.standbyPay} €
                </Table.Cell>
                <Table.Cell className="min-w-25">
                  {user.receivedPay} €
                </Table.Cell>
                <Table.Cell className="min-w-25">
                  <Chip
                    color={statusColorMap[user.status]}
                    size="sm"
                    variant="soft"
                  >
                    {user.status}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-1">
                    <Button isIconOnly size="sm" variant="tertiary">
                      <Icon className="size-4" icon="gravity-ui:eye" />
                    </Button>
                    <Button isIconOnly size="sm" variant="tertiary">
                      <Icon className="size-4" icon="gravity-ui:pencil" />
                    </Button>
                    <Button isIconOnly size="sm" variant="danger-soft">
                      <Icon className="size-4" icon="gravity-ui:trash-bin" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
