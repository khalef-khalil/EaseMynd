# EaseMynd

EaseMynd is a comprehensive personal development application that helps users build better habits, manage tasks, track principles, and maintain focus sessions. Built with Next.js and Supabase, it provides a modern, intuitive interface for personal growth and productivity tracking.

## Features

- **Habit Tracking**: Monitor both good and bad habits with detailed statistics
  - Track streaks and success rates
  - View daily progress
  - Analyze habit patterns over time

- **Principles Management**
  - Document and track life principles
  - Test and validate principles
  - Monitor implementation progress

- **Focus Sessions**
  - Track focused work sessions
  - Set and achieve session goals
  - Monitor total focus time
  - Analyze success rates

- **Task Management**
  - Create and track tasks
  - Monitor task completion rates
  - View task statistics and progress

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Hosting**: Vercel (recommended)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/khalef-khalil/EaseMynd.git
   cd EaseMynd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a new project in Supabase
   - Run the database schema provided in `schema.sql`
   - Enable Row Level Security (RLS) policies

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Database Schema

The application uses the following main tables:
- `habits`: Stores habit information and types
- `habit_logs`: Tracks daily habit completion
- `principles`: Stores life principles and their status
- `tasks`: Manages task information
- `focus_sessions`: Records focus session data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

- Khalil Khalef
- GitHub: [@khalef-khalil](https://github.com/khalef-khalil)

## Acknowledgments

- Thanks to all contributors who help improve this project
- Built with Next.js and Supabase
- UI components inspired by Tailwind CSS
