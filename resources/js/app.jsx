import "../sass/app.scss";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot, hydrateRoot } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME || "Restu Food";

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => {
    // Check if the page is from a module (starts with "Modules/")
    if (name.startsWith('Modules/')) {
      // Split the path to get module name and page path
      const parts = name.split('/');
      const moduleName = parts[1];
      const pagePath = parts.slice(2).join('/');

      // For module pages, use the correct path to resources/Pages
      return resolvePageComponent(`../../${name.split('/').slice(0, 2).join('/')}/resources/Pages/${pagePath}.jsx`,
        import.meta.glob('../../Modules/*/resources/Pages/**/*.jsx'));
    }

    return resolvePageComponent(
      `./Pages/${name}.jsx`,
      import.meta.glob("./Pages/**/*.jsx")
    );

  },
  setup({ el, App, props }) {
    if (import.meta.env.SSR) {
      hydrateRoot(el, <App {...props} />);
      return;
    }

    createRoot(el).render(<App {...props} />);
  },
  progress: {
    color: "#4B5563",
  },
});
