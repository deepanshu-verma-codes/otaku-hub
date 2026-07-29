import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const query = `
    query ($id: Int) {
      Media (id: $id, type: ANIME) {
        id idMal episodes seasonYear description(asHtml: false) bannerImage popularity
        title { english romaji }
        coverImage { extraLarge large }
        relations {
          edges {
            relationType
            node {
              id idMal title { english romaji } format type episodes coverImage { large }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query, variables: { id: parseInt(id) } })
    });
    
    const data = await res.json();
    if (!data.data || !data.data.Media) return NextResponse.json({ message: "Anime not found" }, { status: 404 });

    const m = data.data.Media;
    
    // Extract related seasons (PREQUEL, SEQUEL, ALTERNATIVE, etc. that are ANIME and TV/ONA/OVA)
    let seasons = [
      {
        id: m.id.toString(),
        idMal: m.idMal,
        title: "Season 1",
        fullTitle: m.title.english || m.title.romaji,
        romajiTitle: m.title.romaji || m.title.english,
        episodes: m.episodes || 12,
        cover: m.coverImage.large
      }
    ];

    if (m.relations && m.relations.edges) {
      const relatedAnimes = m.relations.edges
        .filter((edge: any) => edge.node.type === "ANIME" && ["TV", "ONA", "OVA"].includes(edge.node.format))
        .map((edge: any, index: number) => ({
          id: edge.node.id.toString(),
          idMal: edge.node.idMal,
          title: edge.relationType === "SEQUEL" ? `Season ${index + 2}` : edge.relationType.replace(/_/g, " "),
          fullTitle: edge.node.title.english || edge.node.title.romaji,
          romajiTitle: edge.node.title.romaji || edge.node.title.english,
          episodes: edge.node.episodes || 12,
          cover: edge.node.coverImage.large
        }));
      
      seasons = [...seasons, ...relatedAnimes];
    }

    return NextResponse.json({
      id: m.id.toString(),
      idMal: m.idMal,
      title: m.title.english || m.title.romaji,
      description: m.description ? m.description.replace(/<[^>]*>?/gm, '') : "No description provided.",
      thumbnail: m.coverImage.extraLarge,
      banner: m.bannerImage || m.coverImage.extraLarge,
      seasons: seasons
    });
  } catch(err) {
    return NextResponse.json({ message: "Error fetching anime" }, { status: 500 });
  }
}
