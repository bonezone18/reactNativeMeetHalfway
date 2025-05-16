# Meet Halfway App

## Overview

Meet Halfway is a mobile application designed to help users find convenient meeting locations between two starting points. The app calculates the optimal midpoint based on geography or estimated travel time and suggests venues like restaurants, cafes, and parks in that area. It's perfect for friends, couples, coworkers, or co-parents looking to find a mutually convenient meeting spot.

## Technology Stack

- **Framework**: React Native
- **Language**: TypeScript
- **State Management**: Zustand
- **Maps & Location**: Google Maps API, react-native-maps, react-native-geolocation-service
- **Navigation**: React Navigation
- **Environment Variables**: react-native-dotenv

## Key Features

1. **Location Input**
   - Manual address entry
   - Current location detection
   - Google Places autocomplete

2. **Midpoint Calculation**
   - Geographic midpoint calculation
   - Travel time-based midpoint calculation
   - Adjustable midpoint via map dragging

3. **Venue Discovery**
   - Nearby places search using Google Places API
   - Filtering by venue type, rating, and price
   - Sorting options (distance, rating, etc.)

4. **Map Visualization**
   - Interactive map with location markers
   - Draggable midpoint marker
   - Toggle between map and list views

5. **Venue Details**
   - Photos, ratings, and reviews
   - Opening hours and contact information
   - Distance and travel time for each user

## Setup Instructions

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, Mac only)
- Google Maps API key

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/meet_halfway_rn.git
   cd meet_halfway_rn
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Configure Google Maps API**

   For Android:
   - Open `android/app/src/main/AndroidManifest.xml`
   - Add the following inside the `<application>` tag:
     ```xml
     <meta-data
       android:name="com.google.android.geo.API_KEY"
       android:value="${GOOGLE_MAPS_API_KEY}"/>
     ```

   For iOS (if applicable):
   - Open `ios/YourAppName/AppDelegate.mm`
   - Add the following import:
     ```objective-c
     #import <GoogleMaps/GoogleMaps.h>
     ```
   - Add this line in the `application:didFinishLaunchingWithOptions` method:
     ```objective-c
     [GMSServices provideAPIKey:@"YOUR_API_KEY"];
     ```

5. **Run the app**

   For Android:
   ```bash
   npx react-native run-android
   ```

   For iOS (Mac only):
   ```bash
   npx react-native run-ios
   ```

## Project Structure

```
meet_halfway_rn/
├── android/                  # Android native code
├── ios/                      # iOS native code
├── src/
│   ├── api/                  # API integration
│   │   ├── googleMapsApi.ts  # Google Maps API functions
│   │   └── types.ts          # API response types
│   ├── components/           # Reusable UI components
│   │   ├── Button/           # Custom button components
│   │   ├── CircularButton/   # Circular "Meet Halfway" button
│   │   ├── LocationInput/    # Location input component
│   │   ├── MapComponent/     # Map visualization component
│   │   ├── PlaceCard/        # Venue card component
│   │   └── ...
│   ├── models/               # Data models
│   │   ├── locationTypes.ts  # Location data types
│   │   └── placeTypes.ts     # Place/venue data types
│   ├── navigation/           # Navigation configuration
│   │   └── AppNavigator.tsx  # Main navigation setup
│   ├── screens/              # App screens
│   │   ├── HomeScreen.tsx    # Main input screen
│   │   └── ResultsScreen.tsx # Results display screen
│   ├── services/             # Business logic services
│   │   └── MidpointCalculator.ts # Midpoint calculation logic
│   ├── state/                # State management
│   │   └── stores/           # Zustand stores
│   │       ├── locationStore.ts # Location state management
│   │       ├── midpointStore.ts # Midpoint state management
│   │       └── placeStore.ts    # Places/venues state management
│   ├── styles/               # Global styles
│   │   └── theme.ts          # Theme configuration
│   └── utils/                # Utility functions
│       └── permissionUtils.js # Permission handling utilities
├── .env                      # Environment variables (not in repo)
├── App.tsx                   # App entry point
├── babel.config.js           # Babel configuration
├── package.json              # Project dependencies
└── tsconfig.json             # TypeScript configuration
```

## Core Components and Their Functions

### 1. Location Input (src/components/LocationInput)

The LocationInput component handles user input for starting locations. It supports:
- Text input for manual address entry
- Current location detection via the device's GPS
- Address autocomplete using Google Places API

### 2. Circular Button (src/components/CircularButton)

The main call-to-action button that triggers the midpoint calculation. Features:
- Circular design with 120x120px dimensions
- Emerald green color (#2ECC71)
- Haptic feedback on press
- Elevation and shadow effects

### 3. Map Component (src/components/MapComponent)

Displays an interactive map with:
- Markers for both starting locations
- A marker for the calculated midpoint
- Draggable midpoint marker for manual adjustment
- Proper camera positioning to show all markers

### 4. Results Screen Content (src/components/ResultsScreenContent)

Displays the search results with:
- Toggle between map and list views
- Filtering and sorting options
- List of nearby venues with details
- Distance and travel time information

## State Management

The app uses Zustand for state management, with three main stores:

### 1. Location Store (src/state/stores/locationStore.ts)

Manages the starting locations (A and B) with functions for:
- Setting locations manually
- Fetching current location with device GPS
- Handling loading states and errors

### 2. Midpoint Store (src/state/stores/midpointStore.ts)

Handles the calculated midpoint with:
- Midpoint calculation logic
- Midpoint adjustment
- Calculation method selection (geographic vs. travel time)

### 3. Place Store (src/state/stores/placeStore.ts)

Manages the venue search results with:
- Fetching nearby places
- Filtering and sorting
- Loading states and error handling

## API Integration

### Google Maps API

The app uses several Google Maps API services:

1. **Geocoding API**
   - Converting addresses to coordinates
   - Reverse geocoding for current location

2. **Places API**
   - Autocomplete for address input
   - Nearby search for venues
   - Place details for venue information

3. **Directions API**
   - Calculating travel time and distance
   - Determining travel time-based midpoints

All API calls are centralized in `src/api/googleMapsApi.ts` with proper error handling and type definitions.

## Common Issues and Troubleshooting

### 1. Location Permissions

If location detection isn't working:
- Ensure location permissions are granted in device settings
- Check that `ACCESS_FINE_LOCATION` and `ACCESS_COARSE_LOCATION` permissions are in AndroidManifest.xml
- Verify that runtime permission requests are implemented correctly

### 2. Google Maps API Key

If maps or place searches aren't working:
- Verify your API key is correct in the .env file
- Ensure the API key is properly configured in AndroidManifest.xml
- Check that the required APIs (Maps, Places, Geocoding, Directions) are enabled in Google Cloud Console

### 3. Map Display Issues

If the map isn't displaying correctly:
- Check that react-native-maps is properly installed and linked
- Verify that the Google Maps API key is correctly set up
- Ensure the device/emulator has Google Play Services installed

### 4. Module Resolution Errors

If you encounter "Unable to resolve module" errors:
- Check import paths (especially for theme.ts from component subdirectories)
- Run `npx react-native start --reset-cache` to clear the Metro bundler cache
- Verify that all dependencies are properly installed

## Future Development Roadmap

### Planned Features

1. **Group Planning Mode**
   - Support for 3+ people meeting
   - Weighted midpoint calculation based on group size

2. **Calendar Integration**
   - Schedule meetings directly from the app
   - Sync with calendar apps

3. **AI-Based Suggestions**
   - Smart venue recommendations based on user preferences
   - Learning from past meeting choices

4. **Partner Integrations**
   - Integration with services like Yelp, Uber, OpenTable
   - Direct booking capabilities

5. **Monetization Features**
   - Premium subscription options
   - Sponsored listings
   - Affiliate deals with local businesses

## Contributing

Contributions to the Meet Halfway app are welcome! Here's how to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Include your license information here]

## Contact

[Your contact information or project maintainer details]

---

This README was last updated on May 16, 2025.
