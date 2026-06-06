import ComingSoonPage from '@/components/ComingSoonPage';

export default function ResearchLibraryPage() {
  return (
    <ComingSoonPage
      eyebrow="Notes & methodology"
      title="Where do the deeper write-ups and the methodology notes live?"
      blurb="A dashboard can show you the what, but not always the why or the how. This page
        is meant to be the place for the longer-form material that doesn't fit on a chart:
        methodology write-ups explaining how a model was built, notes on a particular
        indicator's quirks, and further reading for anyone who wants to go one level deeper."
      plannedQuestions={[
        'How exactly was a particular figure or model on this dashboard built -- and what would change the answer?',
        'What are the known quirks, revisions, or definitional changes behind a specific indicator?',
        'Where can someone go to read more deeply about a topic this dashboard only has room to summarize?',
      ]}
      dataGap={
        <>
          <p>
            <strong className="text-ink">Why there&rsquo;s no preview number here:</strong> this
            page isn&rsquo;t a data view -- it&rsquo;s a writing destination. Its job is to hold
            the methodology notes, indicator deep-dives, and further-reading links that the
            rest of the dashboard points back to, not to add another chart.
          </p>
          <p className="mt-3">
            Once it&rsquo;s built, expect it to grow alongside the dashboard itself: every time a
            model gets a &ldquo;show the work&rdquo; panel elsewhere, the fuller version of that
            explanation should have a home here.
          </p>
        </>
      }
    />
  );
}
