import {
  PersonOutline,
  AnalyticsOutlined,
  SettingsOutlined,
  Code,
  BadgeOutlined,
  Logout,
} from "@mui/icons-material";
import { type ColorPaletteProp } from "@mui/joy/styles";
import { skipToken } from "@tanstack/react-query";
import { useLogout } from "../../../lib/api/auth";
import { trpc } from "../../../lib/api/trpc/trpc";
import {
  type ModalPath,
  type Path,
  useModals,
  useNavigate,
  useParams,
} from "../../../router";
import { useTranslation } from "../../../lib/i18n";
import { useUser } from "../../../lib/api/user";
import { ListDivider, Typography, MenuItem, Menu, Chip, Link } from "@mui/joy";
import { XPBar } from "../../gamification/XPBar";
import { LanguageSelector } from "../../settings/languageSelector";
import { type UserXP } from "../../../lib/api/gamification";
import { UserDisplay } from "./UserDisplay";
import { SIDEBAR_SETTINGS_BUTTON_ID } from "../../../lib/testIds";
import { useLocation } from "react-router";

interface MenuItemInterface {
  label: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  to?: Path;
  modalPath?: ModalPath;
  chipLabel?: string;
  color?: ColorPaletteProp;
  testId?: string;
  doesRender?: boolean;
}
interface MenuItemGroup {
  groupLabel?: string;
  items: MenuItemInterface[];
}

export function UserMenuList({
  userXPData,
  isAcademy,
  hasLanguageSelector = true,
  isMenuCompact,
}: {
  userXPData: UserXP;
  isAcademy?: boolean;
  hasLanguageSelector?: boolean;
  isMenuCompact?: boolean;
}) {
  const { t } = useTranslation();
  const me = useUser("me");
  const modals = useModals();
  const params = useParams("/:organizationId");
  const logout = useLogout();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const orgs = trpc.organization.getAllOrganizations.useQuery().data;
  const hasMultiple = (orgs?.length ?? 0) > 1;

  const { data: apiKeysEnabled } = trpc.apiKeys.enabled.useQuery(
    params.organizationId ? undefined : skipToken,
    {
      trpc: {
        context: {
          silentError: true,
        },
      },
    },
  );

  const menuTitleStyle = "pl-3 pt-1.5 pb-0.5 tracking-wider !text-gray-500";

  const menuItems: MenuItemGroup[] = [
    {
      groupLabel: t("e-learning").toUpperCase(),
      items: [
        {
          label: <XPBar userXPData={userXPData} small={true} />,
          doesRender: !!isAcademy,
        },
      ],
    },
    {
      groupLabel: t("language").toUpperCase(),
      items: [
        {
          label: (
            <LanguageSelector
              sx={{ width: "100%" }}
              filter={isAcademy ? ["de", "en"] : undefined}
            />
          ),
          doesRender: !!hasLanguageSelector,
        },
      ],
    },
    {
      groupLabel: t("account"),
      items: [
        {
          label: t("settings.profile"),
          icon: <PersonOutline color="primary" />,
          doesRender: !!me,
          modalPath: "/[organizationId]/tools/profileSettings",
        },
      ],
    },
    {
      groupLabel: "ADMINISTRATION",
      items: [
        {
          label: t("settings.tabs.metrics"),
          icon: <AnalyticsOutlined color="primary" />,
          doesRender: !!me?.isOrganizationAdmin && !isMenuCompact,
          to: "/:organizationId/adoption",
          chipLabel: "Admin",
        },
        {
          label: t("einstellungen"),
          icon: <SettingsOutlined color="primary" />,
          doesRender: !!me?.isOrganizationAdmin && !isMenuCompact,
          to: "/:organizationId/settings",
          chipLabel: "Admin",
          testId: SIDEBAR_SETTINGS_BUTTON_ID,
        },
      ],
    },
    {
      groupLabel: t("developer"),
      items: [
        {
          label: t("settings.apiKeys"),
          icon: <Code color="primary" />,
          doesRender: !!apiKeysEnabled,
          modalPath: "/apiKeys",
        },
      ],
    },
    {
      items: [
        {
          label: t("switchOrganization"),
          icon: <BadgeOutlined color="primary" />,
          doesRender: hasMultiple && pathname !== "/auth",
          to: "/",
        },
      ],
    },
    {
      items: [
        {
          label: t("logout"),
          icon: <Logout />,
          onClick: logout,
          doesRender: !!me,
          color: "danger",
        },
      ],
    },
  ];

  const filteredMenuItems = menuItems.filter((group) =>
    group.items.some((item: MenuItemInterface) => item.doesRender),
  );

  return (
    <Menu placement="bottom-end" className="!p-0 !text-sm">
      <div className="bg-blue-50 p-3 pr-[90px]">
        <UserDisplay isAcademy={isAcademy} userXPData={userXPData} />
      </div>
      <ListDivider sx={{ mt: 0 }} />
      {filteredMenuItems.map((group, index) => (
        <div
          key={"group-" + index}
          style={{
            marginBottom: index === filteredMenuItems.length - 1 ? 0 : "0.5rem",
          }}
        >
          {group.groupLabel && (
            <Typography level="body-xs" className={menuTitleStyle}>
              {group.groupLabel.toUpperCase()}
            </Typography>
          )}
          {group.items.map(
            (item, i) =>
              item.doesRender && (
                <MenuItem
                  key={"item-" + index + "-" + i}
                  data-testid={item.testId}
                  color={item.color}
                  onClick={async () => {
                    item.onClick?.();
                    item.modalPath && modals.open(item.modalPath, { params });
                    if (item.to) {
                      await navigate(item.to, { params });
                    }
                  }}
                >
                  <div className="flex w-full items-center justify-between gap-7">
                    <div className="flex w-full items-center gap-2">
                      {item.icon}
                      {item.label}
                    </div>
                    {item.chipLabel && (
                      <Chip color="primary" size="sm">
                        {item.chipLabel}
                      </Chip>
                    )}
                  </div>
                </MenuItem>
              ),
          )}
        </div>
      ))}
      <ListDivider sx={{ mb: 0 }} className="!bg-gray-100" />
      <Typography level="body-xs" className="p-1" textAlign="center">
        {t("poweredBy")} <Link href="https://deingpt.com">deingpt</Link>
      </Typography>
    </Menu>
  );
}
