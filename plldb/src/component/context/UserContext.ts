import { createContext } from 'react';

import { User } from '../../model/User';

interface UserContextType {
	user: User | null;
	setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
	user: null,
	setUser: (user: User | null) => {}
});

export { UserContext };