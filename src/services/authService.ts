export interface UserProfile {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  avatar: string;
  rankTitle: string;
  rankLevel: number;
  xp: number;
  testsCompleted: number;
  avgScore: number;
  isLoggedIn: boolean;
  createdAt: string;
}

export interface UserAccountRecord extends UserProfile {
  passwordHash: string;
}

const DEFAULT_USER: UserProfile = {
  id: 'guest',
  name: 'Candidate Engineer',
  email: '',
  jobTitle: 'Software Engineer',
  avatar: '👨‍💻',
  rankTitle: 'Novice Engineer',
  rankLevel: 1,
  xp: 0,
  testsCompleted: 0,
  avgScore: 0,
  isLoggedIn: false,
  createdAt: new Date().toISOString(),
};

export class AuthService {
  private static ACTIVE_USER_KEY = 'gemini_active_user';
  private static DB_KEY = 'gemini_registered_users_db';

  /**
   * Get all registered accounts database
   */
  private static getAccountsDatabase(): Record<string, UserAccountRecord> {
    const saved = localStorage.getItem(this.DB_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {};
  }

  /**
   * Save accounts database
   */
  private static saveAccountsDatabase(db: Record<string, UserAccountRecord>) {
    localStorage.setItem(this.DB_KEY, JSON.stringify(db));
  }

  /**
   * Get currently active logged-in user
   */
  static getUser(): UserProfile {
    const saved = localStorage.getItem(this.ACTIVE_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_USER;
  }

  /**
   * Register a new persistent candidate account
   */
  static registerAccount(name: string, email: string, password: string, jobTitle: string = 'Full-Stack Developer'): UserProfile {
    const db = this.getAccountsDatabase();
    const cleanEmail = email.trim().toLowerCase();

    const newRecord: UserAccountRecord = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'Software Engineer',
      email: cleanEmail,
      jobTitle: jobTitle.trim() || 'Full-Stack Developer',
      passwordHash: password,
      avatar: '👨‍💻',
      rankTitle: 'Junior Engineer',
      rankLevel: 1,
      xp: 100,
      testsCompleted: 0,
      avgScore: 0,
      isLoggedIn: true,
      createdAt: new Date().toISOString(),
    };

    db[cleanEmail] = newRecord;
    this.saveAccountsDatabase(db);

    const userProfile: UserProfile = { ...newRecord };
    delete (userProfile as any).passwordHash;

    localStorage.setItem(this.ACTIVE_USER_KEY, JSON.stringify(userProfile));
    return userProfile;
  }

  /**
   * Login with registered email & password
   */
  static loginWithCredentials(email: string, password?: string): UserProfile {
    const db = this.getAccountsDatabase();
    const cleanEmail = email.trim().toLowerCase();

    if (db[cleanEmail]) {
      const record = db[cleanEmail];
      const userProfile: UserProfile = {
        ...record,
        isLoggedIn: true,
      };
      localStorage.setItem(this.ACTIVE_USER_KEY, JSON.stringify(userProfile));
      return userProfile;
    }

    // Auto-create account if new email
    return this.registerAccount(cleanEmail.split('@')[0] || 'Software Engineer', cleanEmail, password || 'password123');
  }

  /**
   * Update current user profile details (Name & Job Title)
   */
  static updateUserProfile(name: string, jobTitle: string): UserProfile {
    const user = this.getUser();
    if (!user.isLoggedIn) return user;

    const updated: UserProfile = {
      ...user,
      name: name.trim() || user.name,
      jobTitle: jobTitle.trim() || user.jobTitle,
    };

    const db = this.getAccountsDatabase();
    if (db[user.email.toLowerCase()]) {
      db[user.email.toLowerCase()] = {
        ...db[user.email.toLowerCase()],
        ...updated,
      };
      this.saveAccountsDatabase(db);
    }

    localStorage.setItem(this.ACTIVE_USER_KEY, JSON.stringify(updated));
    return updated;
  }

  /**
   * Logout current active user
   */
  static logout(): UserProfile {
    const updated: UserProfile = {
      ...DEFAULT_USER,
      isLoggedIn: false,
    };
    localStorage.setItem(this.ACTIVE_USER_KEY, JSON.stringify(updated));
    return updated;
  }

  /**
   * Add XP and update rank statistics in database
   */
  static addXP(earnedXP: number, scorePercentage: number): UserProfile {
    const user = this.getUser();
    if (!user.isLoggedIn) return user;

    const newXP = user.xp + earnedXP;
    const newTestsCount = user.testsCompleted + 1;
    const newAvgScore = Math.round(((user.avgScore * user.testsCompleted) + scorePercentage) / newTestsCount);

    let rankTitle = 'Junior Engineer';
    let rankLevel = 1;

    if (newXP >= 5000) {
      rankTitle = 'Legendary Principal Architect (#1)';
      rankLevel = 5;
    } else if (newXP >= 2500) {
      rankTitle = 'Senior Staff Engineer (#5)';
      rankLevel = 4;
    } else if (newXP >= 1000) {
      rankTitle = 'Senior Full-Stack Developer (#12)';
      rankLevel = 3;
    } else if (newXP >= 300) {
      rankTitle = 'Mid-Level Software Engineer';
      rankLevel = 2;
    }

    const updated: UserProfile = {
      ...user,
      xp: newXP,
      testsCompleted: newTestsCount,
      avgScore: newAvgScore,
      rankTitle,
      rankLevel,
    };

    // Update DB
    const db = this.getAccountsDatabase();
    if (db[user.email.toLowerCase()]) {
      db[user.email.toLowerCase()] = {
        ...db[user.email.toLowerCase()],
        ...updated,
      };
      this.saveAccountsDatabase(db);
    }

    localStorage.setItem(this.ACTIVE_USER_KEY, JSON.stringify(updated));
    return updated;
  }
}
