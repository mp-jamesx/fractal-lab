// Labels are authored route metadata, never user-supplied HTML.
export function breadcrumbs(current) {
  const root = current ? `<a href="${import.meta.env.BASE_URL}">All experiments</a><span aria-hidden="true">/</span><span aria-current="page">${current}</span>` : '<span aria-current="page">All experiments</span>';
  return `<nav class="lab-breadcrumb" aria-label="Breadcrumb">${root}</nav>`;
}
