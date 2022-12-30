## Innovault

First, install dependencies:

```bash
npm i
# or
yarn
```

then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the web application.

### Folder structure

- **src** - contains all files for running the project
    - _components_ - re-usable child components are added here to be used by other pages
        - folder structure inside would be like this `CustomImage/[id].tsx`
        - naming convention for styles per folder is `CustomImage/customImage.module.css`.
    - _pages_ - nextjs routes. You can add `_document.tsx` here
    - _services_ - anything that has to do with env files, apollo client and others
    - _theme_ - contains global css, reusable classes and theme provider
    - _utils_ - re-usable functionalities are stored here.
