import React from "react";
import { Button } from "react-bootstrap";
import { AiOutlineCamera, AiOutlineFileJpg } from "react-icons/ai";

function IconButton({
  variant,
  ariaLabel,
  onClick,
  iconType,
  hidden,
}: {
  variant: string;
  ariaLabel: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  iconType: "camera" | "file";
  hidden: boolean;
}) {
  const Icon = iconType === "camera" ? AiOutlineCamera : AiOutlineFileJpg;

  return (
    <Button
      variant={variant}
      className="p-5"
      aria-label={ariaLabel}
      onClick={onClick}
      hidden={hidden}
    >
      <Icon size={70} color="green" />
    </Button>
  );
}

export default IconButton;
