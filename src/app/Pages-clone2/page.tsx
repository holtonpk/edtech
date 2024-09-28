"use client";
import React from "react";

import {Pages} from "./Pages";
import {Layout} from "./PageComp";

export const Horizontal = () => <Pages layout={Layout.Horizontal} />;

export const Vertical = () => <Pages layout={Layout.Vertical} />;

export const Grid = () => <Pages layout={Layout.Grid} />;

const Page = () => {
  return <Vertical />;
};

export default Page;
