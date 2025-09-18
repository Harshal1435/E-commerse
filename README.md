# Project: Vite React Ecommerce UI

## Overview
This project is a React-based ecommerce UI built with Vite. It features product listing, filtering, sorting, and product detail views.

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
	```sh
	git clone <your-repo-url>
	cd project
	```
2. Install dependencies:
	```sh
	npm install
	# or
	yarn install
	```

### Running the App
To start the development server:
```sh
npm run dev
# or
yarn dev
```
The app will be available at `http://localhost:5173` by default.

### Building for Production
To build the app for production:
```sh
npm run build
# or
yarn build
```
The output will be in the `dist` folder.

### Linting
To run ESLint:
```sh
npm run lint
# or
yarn lint
```

## Project Structure
```
project/
├── public/               # Static assets
├── src/                  # Source code
│   ├── assets/           # Images and icons
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   ├── App.css           # App-level styles
│   └── index.css         # Global styles
├── index.html            # HTML template
├── package.json          # Project metadata and scripts
├── vite.config.js        # Vite configuration
├── eslint.config.js      # ESLint configuration
└── README.md             # Project documentation
```

## Key Features
- Product grid and detail view
- Filtering and sorting
- Responsive design
- Loading indicators

## Scripts
- `dev`: Start development server
- `build`: Build for production
- `preview`: Preview production build
- `lint`: Run ESLint

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
