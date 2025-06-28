"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

const ThemeSwitcher = () => {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme("light"); }, [setTheme]);
  return null;
};

          <Sun
            key="light"
            size={ICON_SIZE}
            className={"text-muted-foreground"}
          />
        ) : theme === "dark" ? (
          <Moon
            key="dark"
            size={ICON_SIZE}
            className={"text-muted-foreground"}
          />
        ) : (
          <Laptop
            key="system"
            size={ICON_SIZE}
            className={"text-muted-foreground"}
          />
        )}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-content" align="start">
      <DropdownMenuRadioGroup
        value={theme}
        onValueChange={(e) => setTheme(e)}
      >
        <DropdownMenuRadioItem className="flex gap-2" value="light">
          <Sun size={ICON_SIZE} className="text-muted-foreground" />{" "}
          <span>Light</span>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem className="flex gap-2" value="dark">
          <Moon size={ICON_SIZE} className="text-muted-foreground" />{" "}
          <span>Dark</span>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem className="flex gap-2" value="system">
          <Laptop size={ICON_SIZE} className="text-muted-foreground" />{" "}
          <span>System</span>
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"sm"}>
          {theme === "light" ? (
            <Sun
              key="light"
              size={ICON_SIZE}
              className={"text-muted-foreground"}
            />
          ) : theme === "dark" ? (
            <Moon
              key="dark"
              size={ICON_SIZE}
              className={"text-muted-foreground"}
            />
          ) : (
            <Laptop
              key="system"
              size={ICON_SIZE}
              className={"text-muted-foreground"}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(e) => setTheme(e)}
        >
          <DropdownMenuRadioItem className="flex gap-2" value="light">
            <Sun size={ICON_SIZE} className="text-muted-foreground" />{" "}
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="dark">
            <Moon size={ICON_SIZE} className="text-muted-foreground" />{" "}
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="system">
            <Laptop size={ICON_SIZE} className="text-muted-foreground" />{" "}
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
