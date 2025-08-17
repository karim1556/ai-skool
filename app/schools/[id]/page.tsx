import Image from "next/image";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { School } from "@/types/school";

export const dynamic = "force-dynamic";

export default async function SchoolDetailPage({ params }: { params: { id: string } }) {
  const db = getDb();
  const school = await db.get<School>("SELECT * FROM schools WHERE id = $1", [params.id]);
  if (!school) return notFound();

  const location = [school.city, school.state, school.country].filter(Boolean).join(", ");
  const address = [school.address_line1, school.address_line2].filter(Boolean).join(", ");
  const rawSocial = school.social_links as any;
  const social: Record<string, string | undefined> =
    typeof rawSocial === "string"
      ? (() => { try { return JSON.parse(rawSocial) } catch { return {} } })()
      : (rawSocial || {});

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-56 bg-gray-200 relative">
        {school.banner_url && (
          <Image src={school.banner_url} alt={`${school.name} banner`} fill sizes="100vw" className="object-cover" />
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 relative rounded-lg overflow-hidden bg-gray-100">
              {school.logo_url && (
                <Image src={school.logo_url} alt={`${school.name} logo`} fill sizes="128px" className="object-contain p-2" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{school.name}</h1>
              {school.accreditation && (
                <p className="text-sm text-gray-600 mt-1">Accreditation: {school.accreditation}</p>
              )}
              <div className="text-sm text-gray-600 mt-2 space-y-1">
                {location && <p>Location: {location}</p>}
                {address && <p>Address: {address}</p>}
                {school.email && <p>Email: {school.email}</p>}
                {school.phone && <p>Phone: {school.phone}</p>}
                {school.website && (
                  <p>
                    Website: <a className="text-blue-600 hover:underline" href={school.website} target="_blank" rel="noopener noreferrer">{school.website}</a>
                  </p>
                )}
              </div>
            </div>
          </div>

          {school.description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-gray-700 leading-relaxed">{school.description}</p>
            </div>
          )}

          {(social.facebook || social.instagram || social.twitter || social.linkedin || social.youtube) && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Social</h2>
              <div className="flex flex-wrap gap-3 text-sm">
                {social.facebook && (
                  <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" href={social.facebook}>Facebook</a>
                )}
                {social.instagram && (
                  <a className="text-pink-600 hover:underline" target="_blank" rel="noopener noreferrer" href={social.instagram}>Instagram</a>
                )}
                {social.twitter && (
                  <a className="text-sky-500 hover:underline" target="_blank" rel="noopener noreferrer" href={social.twitter}>Twitter</a>
                )}
                {social.linkedin && (
                  <a className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer" href={social.linkedin}>LinkedIn</a>
                )}
                {social.youtube && (
                  <a className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer" href={social.youtube}>YouTube</a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
