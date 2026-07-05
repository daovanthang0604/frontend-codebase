import { APP_NAME } from "@/constants/common"

export function getPageTitle(pageTitle?: string) {
  return pageTitle ? `${pageTitle} - ${APP_NAME}` : APP_NAME
}
