import {constructMetadata} from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Frizzle AI",
});

export default function Layout({children}: {children: React.ReactNode}) {
  return <main>{children}</main>;
}
