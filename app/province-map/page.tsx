import ComingSoonPage from '@/components/ComingSoonPage';

export default function ProvinceMapPage() {
  return (
    <ComingSoonPage
      eyebrow="A geography of growth"
      title="Where in Thailand is growth actually happening?"
      blurb="National averages can hide a lot. Bangkok and the Eastern Seaboard tell a very
        different growth story than the Northeast or the deep South -- and a single GDP
        figure for the whole country flattens that into one number. This page is meant to
        put a map back underneath the statistics."
      plannedQuestions={[
        'Which provinces or regions are pulling national growth up, and which are being left behind?',
        'How concentrated is investment -- is it clustering around Bangkok and a few industrial corridors, or spreading out?',
        'Where does regional disparity show up most starkly: income, infrastructure, employment, or something else?',
      ]}
      dataGap={
        <>
          <p>
            <strong className="text-ink">Why there&rsquo;s no preview number here:</strong> every
            indicator in this project&rsquo;s current dataset is a national-level annual time
            series -- there is no province-by-province breakdown to draw from yet. Building this
            page honestly means first sourcing a regional dataset (the National Statistical
            Office publishes provincial accounts, and the NESDC tracks regional growth
            disparities) and only then designing the map and comparisons on top of it.
          </p>
          <p className="mt-3">
            Naming that gap here is more useful than filling the space with an illustrative
            number that doesn&rsquo;t actually exist in the data behind this dashboard.
          </p>
        </>
      }
    />
  );
}
