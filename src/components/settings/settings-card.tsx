import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Heading grup (`###`) di atas satu atau beberapa SettingsCard.
 */
function SettingsSection({
  title,
  description,
  className,
  children,
}: {
  title?: string
  description?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn("space-y-2", className)}>
      {(title || description) && (
        <div className="space-y-1 px-1 pt-2">
          {title && (
            <h3 className="text-base font-medium leading-tight text-foreground">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm leading-snug text-foreground/80">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

/**
 * Wadah kartu grup (Claude-style): border tipis + baris terbagi otomatis.
 * Baris langsung (SettingsRow, dll.) otomatis mendapat pembatas.
 */
function SettingsCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="settings-card"
      className={cn(
        "divide-y divide-border overflow-hidden rounded-xl border border-border/60 bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Baris pengaturan: kiri = label (+ deskripsi `>`), kanan = kontrol.
 */
function SettingsRow({
  label,
  description,
  htmlFor,
  className,
  children,
  ...props
}: {
  label?: React.ReactNode
  description?: React.ReactNode
  htmlFor?: string
  className?: string
  children?: React.ReactNode
} & Omit<React.ComponentProps<"div">, "children">) {
  return (
    <div
      data-slot="settings-row"
      className={cn(
        "flex items-center justify-between gap-4 px-4 py-3.5",
        className
      )}
      {...props}
    >
      <div className="min-w-0 space-y-1">
        {label && (
          <div
            className="text-sm font-medium leading-tight"
            {...(htmlFor ? {} : undefined)}
          >
            {label}
          </div>
        )}
        {description && (
          <p className="text-sm leading-snug text-foreground/80">
            {description}
          </p>
        )}
      </div>
      {children != null && (
        <div className="flex shrink-0 w-full md:w-auto items-center gap-2">{children}</div>
      )}
    </div>
  )
}

/**
 * Deskripsi (`>`) berdiri sendiri di dalam kartu (bukan di bawah label).
 */
function SettingsDescription({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="settings-description"
      className={cn("px-4 py-3.5 text-sm leading-snug text-foreground/80", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export {
  SettingsSection,
  SettingsCard,
  SettingsRow,
  SettingsDescription,
}
