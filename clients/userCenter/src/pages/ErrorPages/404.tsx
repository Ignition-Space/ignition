/* 404 NotFound */

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import Img from "@/assets/error.gif";

export default function NotFoundContainer(): JSX.Element {
  const router = useRouter();
  const gotoHome = (): void => {
    router.push("/");
  };
  return (
    <div className="page-error">
      <div>
        <div className="title">404</div>
        <div className="info">Oh dear</div>
        <div className="info">这里什么也没有</div>
        <Button className="backBtn" type="primary" ghost onClick={gotoHome}>
          返回首页
        </Button>
      </div>
      <img src={Img.src} alt="404 error" />
    </div>
  );
}
