<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## App architecture
- Public content uses individual TanStack leaf routes with leaf SEO metadata and a shared root shell, so every destination is directly navigable.
- CasinoProvider holds language and demo enquiry state in memory only; the prototype intentionally has no real authentication or durable personal-data storage.
- Directory facts and bilingual labels live in casino-data; retain planned-development and unverified-status flags across every display surface.
- Downloaded photography uses asset pointers and is illustrative only; property photos require separate approval to avoid implying affiliation.
- Home-screen support is manifest-only without a service worker, because offline behavior was not requested.
- Enquiry validation and CSV escaping live in a browser-safe shared module; keep country values language-independent so switching languages cannot corrupt form selections or exported records.