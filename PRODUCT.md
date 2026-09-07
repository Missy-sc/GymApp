# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Athletes & Fitness Enthusiasts**: Active individuals who want structured, distraction-free guidance during their physical workouts, tracking exercises, rounds, blocks, and rest periods without needing to manually count or tap their devices constantly.
- **Gym Instructors**: Professionals who want to create, structure, and schedule instructor-led gym classes to coordinate group workouts and assign them on a shared training calendar.

## Product Purpose
To provide a responsive, highly-focused, and robust interactive workout companion ("gym-flow") that guides users seamlessly through customizable structured fitness routines. Success is defined by an athlete completing their session with zero friction, guided naturally by precise timing, sound cues, and visual indicators under any network condition.

## Positioning
A fully client-driven, offline-first workout execution engine featuring 15 vibrantly tailored themes, supporting flexible training modes (time, reps, free), built-in vocal and sound synthesizer cues, and calendar-integrated routine/class scheduling—all running directly in the browser with standard web technologies and no external heavy dependencies.

## Operating Context
- **At the Gym / At Home / Outdoor Training**: High-movement, high-sweat, mobile-first environments where users need immediate readability and giant, touch-safe controls.
- **Dynamic Connection States**: Intermittent cell coverage or completely offline gyms, requiring the application to operate flawlessly using standard `localStorage` as an offline-only fallback and syncing seamlessly to Firebase Firestore and Storage when online.

## Capabilities and Constraints
- **Capabilities**:
  - **Authentication**: Email/Password and Google OAuth via Firebase, falling back gracefully to local-only offline mode if credentials or firebase configuration are absent.
  - **Routine Editor**: A block-and-round builder allowing users to group, reorder, configure rounds, rest periods, and individual exercise modes ('time', 'reps', 'free').
  - **Workout Engine**: Real-time workout session tracking through continuous states (Preparing, Exercise, Rest between exercises, Rest between rounds, Rest between blocks, Completed). Supports manual or auto-advancing, beep/vibe cues, and SpeechSynthesis voice guides.
  - **Exercise Catalog**: Searchable and highly filterable catalog categorized by body parts, target muscles, equipment, difficulty levels, and more.
  - **Scheduling**: Calendar assignments mapping routines or classes to specific dates.
- **Constraints**:
  - Relies exclusively on custom native CSS (`src/styles.css`) for UI structure and themes; no utility CSS frameworks like Tailwind.
  - Entire application core state is integrated in a unified single-page container to guarantee lightweight execution and instant performance.

## Brand Commitments
- **Visual Identity**: Modern, athletic, energetic aesthetic featuring clean typography and bold layouts.
- **Name**: `GymApp` (internal/package name: `gym-flow`).
- **Personalized Themes**: 15 distinct dynamic themes (e.g., 'touchflow-blue', 'electric-navy', 'petrol-coral', etc.) managed via a dedicated `data-theme` attribute on the HTML document element, modifying CSS color variables.
- **Lucide Icons**: Uniform icon vocabulary using `lucide-react`.

## Evidence on Hand
- Fully working frontend implementation in `src/App.tsx`, `src/styles.css`, and supporting services.
- Seed catalog in `src/data/exercises.ts` with metadata for standard fitness movements.
- Live deployment configuration at GitHub Pages (`https://missy-sc.github.io/GymApp/`).

## Product Principles
- **Frictionless Athletic Flow**: Active workouts require total focus. The interface must prioritize oversized, sweaty-finger-friendly tap zones, ambient audio cues, and hands-free automatic progression to let athletes focus on movement, not screens.
- **Resilience Over Connectivity**: An athlete's workout must never pause due to poor gym signals. The architecture must treat local-first storage and offline operation as first-class citizens, keeping the app alive anywhere.
- **Hyper-Personalized Identity**: Training is highly personal. Allowing users to dynamically switch between 15 colorful aesthetic themes and configure workout blocks precisely ensures the app adapts to the user's mood and style.
- **Empowering Domain Knowledge**: Fitness is built on safety and accuracy. Providing a highly organized, deeply filterable exercise library ensures users have instant, verified access to instructions and muscle targeting details.

## Accessibility & Inclusion
- Accessible dialog and modal behaviors managed by a dedicated focus controller (`DialogFocusManager` in `src/App.tsx`).
- Screen reader semantic tags (`sr-only`) used for visual-only cues.
- Flexible layout adjusting seamlessly to mobile screens.
