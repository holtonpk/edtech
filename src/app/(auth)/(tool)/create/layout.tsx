import {constructMetadata} from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Dashboard",
  image: "image/favicon.ico",
});

export default function Layout({children}: {children: React.ReactNode}) {
  return <main>{children}</main>;
}
