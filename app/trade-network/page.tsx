import ComingSoonPage from '@/components/ComingSoonPage';
import { findSeries } from '@/lib/data';

export default function TradeNetworkPage() {
  const exportsShare = findSeries('exports_gdp_pct');

  return (
    <ComingSoonPage
      eyebrow="Who Thailand trades with"
      title="Who does Thailand actually trade with, and how is that relationship shifting?"
      blurb="Thailand is one of the more trade-exposed economies in the region -- which is a
        strength when global demand is healthy, and a vulnerability when it isn't. This page
        is meant to go beyond the headline trade balance and map the actual relationships:
        which partners and products carry the weight, and how that mix is moving over time."
      plannedQuestions={[
        'How concentrated is Thai trade -- does it lean heavily on a small number of partners or product categories?',
        'How has the export mix shifted over the past two decades, and what does that say about where the economy is headed?',
        'When global demand softens, which trade relationships absorb the most shock, and which hold steady?',
      ]}
      preview={
        exportsShare
          ? {
              label: 'Exports of goods & services, as a share of the whole economy',
              series: exportsShare,
              note: (
                <>
                  At roughly this share of GDP, swings in global demand translate quickly into
                  swings at home -- which is exactly why a fuller picture of <em>who</em> Thailand
                  trades with, and in <em>what</em>, matters more than this single ratio can show.
                  The finished page will break this down by partner and category.
                </>
              ),
            }
          : undefined
      }
    />
  );
}
