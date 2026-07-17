import Image from "next/image";
import { Button } from "@heroui/react";
import { Tabs } from "@heroui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Tabs className="w-full max-w-md">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Options">
          <Tabs.Tab id="work">
            <Link href="/sport">Sport</Link>
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="house">
            <Tabs.Separator />
             Casa
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="uni">
            <Tabs.Separator />
            Università
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="sport">
            <Tabs.Separator />
            Sport
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel className="pt-4" id="overview">
        <p>View your project overview and recent activity.</p>
      </Tabs.Panel>
      <Tabs.Panel className="pt-4" id="analytics">
        <p>Track your metrics and analyze performance data.</p>
      </Tabs.Panel>
      <Tabs.Panel className="pt-4" id="reports">
        <p>Generate and download detailed reports.</p>
      </Tabs.Panel>
    </Tabs>
  );
}
