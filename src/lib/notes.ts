import { Note } from '@/types/note';

export const notes: Note[] = [
  {
    id: 'starter-note-1',
    title: 'Spent the evening trimming product friction instead of adding features',
    date: '2026-03-03',
    weather: 'Clear',
    mood: 'Focused',
    location: 'Home office',
    content: `Tonight was one of those sessions that looks small from the outside and feels important from the inside.

I did not add a headline feature. I cleaned edges.

A few routes were still too rough. Some wording still sounded generic. A couple of flows made people work harder than they should have to. None of those issues were dramatic, but together they kept the site feeling like a project instead of a product.

So I spent the evening reducing friction.

That meant fixing small navigation gaps, tightening the contact path, replacing template-sounding copy, and making sure the site could still present itself well even when the data layer was not in a perfect state.

I keep relearning the same lesson: product quality often arrives through subtraction.

Not more components. Not more decoration. Just fewer awkward moments between intent and action.

That kind of progress is hard to show in a screenshot, but I trust it more than visible polish.
`,
  },
  {
    id: 'starter-note-2',
    title: 'The portfolio got better once I treated it like a conversion surface',
    date: '2026-02-24',
    weather: 'Rainy',
    mood: 'Curious',
    location: 'Desk',
    content: `I had a useful shift in thinking tonight.

For a while I was still treating the portfolio mostly like a personal homepage. That framing led to obvious priorities: visuals, identity, layout, motion.

But the site started improving faster when I reclassified it as a conversion surface.

Once I looked at it that way, the important questions changed:

- Can someone understand what I build quickly?
- Can they find proof of work without hunting for it?
- Can they contact me without friction?
- Does the site hold up if they click deeper than the hero section?

That mindset immediately made the roadmap clearer.

Projects became more important. Calls to action became more important. Social proof became more important. Even notes and supporting content started to matter more, because they help explain how I think, not just what I ship.

I like this framing because it keeps the site honest. If a page does not help someone evaluate the work, it probably should not be taking up that much space.
`,
  },
  {
    id: 'starter-note-3',
    title: 'Writing is not separate from engineering for me anymore',
    date: '2026-02-10',
    weather: 'Windy',
    mood: 'Calm',
    location: 'Studio',
    content: `I used to think of writing as something adjacent to engineering.

Now I think it is part of the same loop.

Whenever I try to explain a system in plain language, weak decisions become visible. If I cannot explain why a route exists, why a data model looks the way it does, or why a user flow matters, the design is usually not as solid as I thought.

That is why notes like this are useful to me.

They are not polished articles. They are checkpoints.

A way to slow down, describe the system honestly, and see whether the reasoning still holds up once it is written down.

In that sense, writing does almost the same job as refactoring.

It removes fog.
`,
  },
];

export function getAllNotes(): Note[] {
  return [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNoteById(id: string): Note | undefined {
  return notes.find((note) => note.id === id);
}
