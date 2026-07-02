import { Separator } from "../Separator"

interface DataTableToolbarContainerProps<TData> {
  header: React.ReactNode
  content?: React.ReactNode
}

export function DataTableToolbarContainer<TData>({
  header,
  content,
}: DataTableToolbarContainerProps<TData>) {
  // TODO: implement the logic to open and close the toolbar
  return (
    <div>
      <div>{header}</div>
      {content && (
        <>
          <Separator />
          <div className="flex items-center justify-between px-6 py-1.5">
            {content}
          </div>
        </>
      )}
    </div>
  )
}
