"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Protect } from "@clerk/nextjs"

interface ProductRow {
  id: number
  name: string
  slug: string
  hero_image?: string | null
  updated_at?: string | null
}

export default function AdminProductsPage() {
  const { toast } = useToast()
  const [rows, setRows] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" })
        const data = await res.json()
        if (!ignore) setRows(Array.isArray(data) ? data : [])
      } catch (e: any) {
        toast({ title: "Failed to load products", description: e?.message || String(e), variant: "destructive" })
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [toast])

  return (
    <Protect role="admin" fallback={<p>Access denied</p>}>
      <AdminLayout>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-gray-600">Manage the products displayed on the site.</p>
          </div>
          <Link href="/admin/products/new">
            <Button>+ Add new product</Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Preview</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Slug</th>
                  <th className="px-4 py-3 text-left">Updated</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>Loading...</td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>No products yet. Click "Add new product" to create one.</td>
                  </tr>
                ) : (
                  rows.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-4 py-3">
                        <div className="w-14 h-14 relative rounded bg-gray-50 overflow-hidden">
                          <Image src={p.hero_image || "/placeholder-logo.png"} alt={p.name} fill className="object-contain p-2" />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600">{p.slug}</td>
                      <td className="px-4 py-3 text-gray-600">{p.updated_at ? new Date(p.updated_at).toLocaleString() : "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link href={`/products/${p.slug}`}><Button variant="outline" size="sm">View</Button></Link>
                          <Link href={`/admin/products/${p.slug}/edit`}><Button size="sm">Edit</Button></Link>
                          <Button size="sm" variant="destructive" onClick={async () => {
                            if (!confirm(`Delete ${p.name}?`)) return;
                            const prev = rows;
                            setRows((r) => r.filter((x) => x.slug !== p.slug));
                            try {
                              const res = await fetch(`/api/products/${p.slug}`, { method: 'DELETE' });
                              if (!res.ok) throw new Error(await res.text());
                              toast({ title: 'Deleted' });
                            } catch (e: any) {
                              setRows(prev);
                              toast({ title: 'Delete failed', description: e?.message || String(e), variant: 'destructive' });
                            }
                          }}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </AdminLayout>
    </Protect>
  )
}
