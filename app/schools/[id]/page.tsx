import Image from "next/image";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MapPin, Phone, Mail, Globe, Award, Home, Linkedin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import type { School } from "@/types/school";

export const dynamic = "force-dynamic";

export default async function SchoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const school = await db.get<School>("SELECT * FROM schools WHERE id = $1", [id]);
  if (!school) return notFound();

  // Fetch school coordinator (basic info only)
  const coordinator = await db.get<any>(
    `SELECT id, first_name, last_name, email, phone, status, image_url, linkedin
     FROM coordinators WHERE school_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [id]
  );

  const location = [school.city, school.state, school.country].filter(Boolean).join(", ");
  const address = [school.address_line1, school.address_line2].filter(Boolean).join(", ");
  const rawSocial = school.social_links as any;
  const social: Record<string, string | undefined> =
    typeof rawSocial === "string"
      ? (() => { try { return JSON.parse(rawSocial) } catch { return {} } })()
      : (rawSocial || {});

  const students = typeof school.student_count === "number" ? school.student_count : undefined;
  const established = school.established_year ? Number(school.established_year) : undefined;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[22rem] sm:h-[26rem] lg:h-[32rem]">
          {/** Compute object-position from focal points (0-100), default 50% */}
          {(() => {
            const fx = typeof (school as any).banner_focal_x === 'number' ? (school as any).banner_focal_x : 50;
            const fy = typeof (school as any).banner_focal_y === 'number' ? (school as any).banner_focal_y : 50;
            const objectPosition = `${fx}% ${fy}%`;
            return (
              <Image
                src={school.banner_url || "/images/skool1.png"}
                alt={`${school.name} banner`}
                fill
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition }}
                priority
              />
            );
          })()}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

          {/* Overlay content bottom-left */}
          <div className="absolute bottom-6 left-0 right-0">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden ring-1 ring-white/25 bg-white/10 backdrop-blur">
                  {school.logo_url ? (
                    <Image src={school.logo_url} alt={`${school.name} logo`} fill sizes="128px" className="object-contain p-2" />
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
                <div className="min-w-0 text-white">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight line-clamp-2" title={school.name}>{school.name}</h1>
                  {school.tagline && <p className="mt-1 text-white/80 line-clamp-1">{school.tagline}</p>}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {typeof students === "number" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20">
                        <Users className="h-3.5 w-3.5" /> {students.toLocaleString()} students
                      </span>
                    )}
                    {typeof established === "number" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20">
                        <Calendar className="h-3.5 w-3.5" /> Est. {established}
                      </span>
                    )}
                    {location && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20">
                        <MapPin className="h-3.5 w-3.5" /> {location}
                      </span>
                    )}
                    {school.accreditation && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20">
                        <Award className="h-3.5 w-3.5" /> {school.accreditation}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action bar */}
      <div className="border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <Link href="/schools" className="hover:underline flex items-center gap-1 text-gray-600"><Home className="h-4 w-4" /> Schools</Link>
            <span className="opacity-60">/</span>
            <span className="line-clamp-1" title={school.name}>{school.name}</span>
          </div>
          <div className="flex gap-2">
            {school.website && (
              <Button size="sm" asChild><a href={school.website} target="_blank" rel="noopener noreferrer">Visit Website</a></Button>
            )}
            {school.email && (
              <Button size="sm" variant="outline" asChild><a href={`mailto:${school.email}`}>Email</a></Button>
            )}
            {school.phone && (
              <Button size="sm" variant="outline" asChild><a href={`tel:${school.phone}`}>Call</a></Button>
            )}
          </div>
        </div>
      </div>

      {/* Gallery */}
      {(() => {
        const primary = [school.banner_url, school.logo_url].filter(Boolean) as string[];
        const placeholders = ["/images/skool.jpg", "/images/skool1.png"];
        const seen = new Set<string>();
        const gallery = [...primary, ...placeholders].filter(src => { if (!src || seen.has(src)) return false; seen.add(src); return true; }).slice(0, 3);
        return gallery.length > 0 ? (
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {gallery.map((src, i) => (
                <div key={i} className="relative h-40 sm:h-36 rounded-xl overflow-hidden ring-1 ring-gray-200 bg-white">
                  <Image src={src} alt={`${school.name} image ${i + 1}`} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        ) : null;
      })()}

      {/* Main Content */}
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {school.description && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader><CardTitle>About</CardTitle></CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-7 whitespace-pre-line">{school.description}</p>
              </CardContent>
            </Card>
          )}

          {coordinator && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader><CardTitle>School Coordinator</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-1 ring-gray-200 bg-gray-50">
                    {coordinator.image_url ? (
                      <Image src={coordinator.image_url} alt="Coordinator" fill sizes="56px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">{(coordinator.first_name?.[0] || 'C').toUpperCase()}</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-base truncate">{`${coordinator.first_name ?? ''} ${coordinator.last_name ?? ''}`.trim() || 'Coordinator'}</div>
                    {coordinator.status && (
                      <div className="text-xs text-gray-500">Status: {coordinator.status}</div>
                    )}
                  </div>
                </div>
                {coordinator.email && (
                  <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-gray-500" /><a className="hover:underline" href={`mailto:${coordinator.email}`}>{coordinator.email}</a></div>
                )}
                {coordinator.phone && (
                  <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-gray-500" /><a className="hover:underline" href={`tel:${coordinator.phone}`}>{coordinator.phone}</a></div>
                )}
                {coordinator.linkedin && (
                  <div className="flex items-center gap-3"><Linkedin className="h-4 w-4 text-gray-500" /><a className="text-blue-600 hover:underline" href={coordinator.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader><CardTitle>Contact & Location</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-gray-700">
              {location && (
                <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-gray-500" /><span>{location}</span></div>
              )}
              {address && (
                <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-gray-500" /><span>{address}</span></div>
              )}
              {school.email && (
                <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-gray-500" /><a className="hover:underline" href={`mailto:${school.email}`}>{school.email}</a></div>
              )}
              {school.phone && (
                <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-gray-500" /><a className="hover:underline" href={`tel:${school.phone}`}>{school.phone}</a></div>
              )}
              {school.website && (
                <div className="flex items-center gap-3"><Globe className="h-4 w-4 text-gray-500" /><a className="text-blue-600 hover:underline" href={school.website} target="_blank" rel="noopener noreferrer">{school.website}</a></div>
              )}
            </CardContent>
          </Card>

          {(school.principal || school.accreditation) && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader><CardTitle>School Info</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                {school.principal && (
                  <div className="flex items-center gap-3"><Award className="h-4 w-4 text-gray-500" /><span>Principal: {school.principal}</span></div>
                )}
                {school.accreditation && (
                  <div className="flex items-center gap-3"><Award className="h-4 w-4 text-gray-500" /><span>Accreditation: {school.accreditation}</span></div>
                )}
              </CardContent>
            </Card>
          )}

          {(social.facebook || social.instagram || social.twitter || social.linkedin || social.youtube) && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader><CardTitle>Social</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {social.facebook && (
                    <a 
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      href={social.facebook}
                      title="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                  {social.instagram && (
                    <a 
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-colors" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      href={social.instagram}
                      title="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  {social.twitter && (
                    <a 
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      href={social.twitter}
                      title="Twitter"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {social.linkedin && (
                    <a 
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      href={social.linkedin}
                      title="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {social.youtube && (
                    <a 
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      href={social.youtube}
                      title="YouTube"
                    >
                      <Youtube className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column (Sticky) */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-8">
            <Card className="shadow-md border border-gray-200 overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  {typeof students === "number" && (
                    <div className="flex items-center gap-3 text-sm text-gray-700"><Users className="h-4 w-4 text-gray-500" /><span>{students.toLocaleString()} students</span></div>
                  )}
                  {typeof established === "number" && (
                    <div className="flex items-center gap-3 text-sm text-gray-700"><Calendar className="h-4 w-4 text-gray-500" /><span>Established {established}</span></div>
                  )}
                  {location && (
                    <div className="flex items-center gap-3 text-sm text-gray-700"><MapPin className="h-4 w-4 text-gray-500" /><span>{location}</span></div>
                  )}
                </div>
                <div className="pt-2 space-y-3 border-t">
                  {school.website && (
                    <Button className="w-full" asChild><a href={school.website} target="_blank" rel="noopener noreferrer">Visit Website</a></Button>
                  )}
                  {school.email && (
                    <Button variant="outline" className="w-full" asChild><a href={`mailto:${school.email}`}>Email</a></Button>
                  )}
                  {school.phone && (
                    <Button variant="outline" className="w-full" asChild><a href={`tel:${school.phone}`}>Call</a></Button>
                  )}
                  <Button variant="secondary" className="w-full" asChild><a href={`mailto:${school.email || "info@"}`}>Enquire Now</a></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
