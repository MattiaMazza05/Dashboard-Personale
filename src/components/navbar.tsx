"use client";
import { Tabs } from "@heroui/react";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-3">
      <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-full shadow-lg">
        <Tabs className="w-full">
          <Tabs.ListContainer>
            <Tabs.List aria-label="Options" className="flex justify-between p-1">
              <Tabs.Tab id="sport" className="flex-1 text-center">
                <Link href="/sport">Sport</Link>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="house" className="flex-1 text-center">
                <Link href="/house">Casa</Link>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="uni" className="flex-1 text-center">
                <Link href="/uni">Università</Link>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="work" className="flex-1 text-center">
                <Link href="/work">Lavoro</Link>
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </div>
    </nav>
  );
}