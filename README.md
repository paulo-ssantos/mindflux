#  Sakai Admin Template for Nuxt 3  

Visit [Sakai Nuxt](https://sakai-nuxt.vercel.app) website for a live preview. 
 
### Getting Started
Sakai is an application template for Vue based on the [Vue CLI](https://cli.vuejs.org/) that provides out-of-the-box standard
tooling for Vue projects. To get started, clone this repository from GitHub and install the dependencies with pnpm or npm or yarn.
                
```bash
pnpm install  # npm install
```

or

```bash
yarn install
```

Next step is running the application using the serve script and navigate to **http://localhost:3000/** to view the application.
That is it, you may now start with the development of your application using the Sakai template.</p>

```bash
pnpm dev # npm run dev
```

or

```bash
yarn dev
```

### Nuxi CLI Scripts
Following commands are derived from create app.
```
"pnpm run dev": Starts the development server
"pnpm run build": Builds the application for deployment.
"pnpm run generate": Builds the application for static deployment.
"pnpm run start": Runs the production server.
```

### Structure
Sakai consists of 2 main parts; the application layout and the resources. **app.vue** inside src folder is the main component containing the template for the base layout whereas required resources such as SASS structure for the layout are placed inside the **src/assets/** folder.</p>

### Layout Components
Main layout is the template of the **app.vue**, it is divided into a couple of child components such as topbar, menu and footer. Here is template of the
**app.vue** component that implements the logic such as menu state, layout modes and so on.

### Menu
Menu is a separate component defined in **AppMenu.vue** file based on PrimeVue MenuModel API. In order to define the menuitems,
navigate to data section of **app.vue** file and define your own model as a nested structure using the **menu** property.

### Dependencies
Dependencies of Sakai are listed below and needs to be added to package.json.

```json
{
    "primeflex": "3.2.1",
    "primeicons": "6.0.1",
    "primevue": "3.17.0"
}
```

### PrimeVue Theme
Sakai uses the free Saga, Arya and Vela themes which are distributed within PrimeVue, however it can be used with any PrimeVue theme as well such as material, tailwind and bootstrap as layout colors are derived from the theme used via CSS variables.

### SASS Variables
In case you'd like to customize the layout variables, open **_variables.scss** file under src/layout folder. The list is pretty short as majority of the variables are derived from the PrimeVue theme being used.

**src/assets/_variables.scss**
```css
$fontSize: 1rem;
$borderRadius: 12px;
$transitionDuration: .2s;
$maskBg: rgba(0, 0, 0, 0.4);
```
