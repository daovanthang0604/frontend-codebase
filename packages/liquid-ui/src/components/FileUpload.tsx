"use client"

import { useRef, useState, type ComponentProps, type ReactNode } from "react"
import { Button } from "@workspace/liquid-ui/components/Button"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { File as FileIcon, Upload, X } from "lucide-react"

// Custom dropzone — Base UI ships no file-upload primitive. A dashed drop area
// that takes drag-and-drop or click-to-browse, plus list/item parts for showing
// what was picked. Stateless about the files themselves: it never stores them, it
// just hands them back through `onFiles`, leaving selection state to the caller.

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  onFiles?: (files: File[]) => void
  disabled?: boolean
  className?: string
  children?: ReactNode
}

function FileUpload({
  accept,
  multiple,
  onFiles,
  disabled,
  className,
  children,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function emit(files: FileList | null) {
    if (!files || files.length === 0) return
    onFiles?.(Array.from(files))
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled) inputRef.current?.click()
      }}
      onKeyDown={(event) => {
        if (disabled) return
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragEnter={(event) => {
        event.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragOver={(event) => {
        event.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragLeave={(event) => {
        event.preventDefault()
        setDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        if (!disabled) emit(event.dataTransfer.files)
      }}
      className={cn(
        "border-gray-a7 cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors",
        dragging && "border-accent-8 bg-accent-a2",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="hidden"
        onChange={(event) => {
          emit(event.target.files)
          // Reset so re-picking the same file still fires onChange.
          event.target.value = ""
        }}
      />
      {children ?? (
        <div className="text-gray-11 flex flex-col items-center gap-2">
          <Upload className="text-gray-9 size-6" />
          <span className="text-sm">
            Drag &amp; drop files here, or click to browse
          </span>
        </div>
      )}
    </div>
  )
}

function FileUploadList({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn("mt-3 space-y-2", className)} {...props} />
}

interface FileUploadItemProps {
  name: string
  size?: number
  onRemove?: () => void
}

function FileUploadItem({ name, size, onRemove }: FileUploadItemProps) {
  return (
    <li className="bg-panel flex items-center gap-3 rounded-md border px-3 py-2 text-sm">
      <FileIcon className="text-gray-9 size-4 shrink-0" />
      <span className="flex-1 truncate">{name}</span>
      {size != null && (
        <span className="text-gray-11 shrink-0">{formatBytes(size)}</span>
      )}
      {onRemove && (
        <Button
          size="xs"
          mode="icon"
          variant="ghost"
          type="button"
          onClick={onRemove}
          className="rounded-sm"
        >
          <X />
          <span className="sr-only">Remove {name}</span>
        </Button>
      )}
    </li>
  )
}

// Human-readable byte size, e.g. 1258291 -> "1.2 MB". Bytes stay whole; KB and up
// get one decimal.
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB", "TB"]
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  )
  const value = bytes / 1024 ** exponent
  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`
}

export { FileUpload, FileUploadItem, FileUploadList }
