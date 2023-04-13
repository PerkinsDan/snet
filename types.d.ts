type Post = {
    post: {
        id: string;
        content: string;
        authorId: string;
        public: boolean;
        createdAt: string;
    };
    author: {
        id: string;
        firstName: string;
        lastName: string;
        profileImageUrl: string;
    };
};

type Profile = {
    id: string;
    school: School;
    schoolId: string;
    userId: string;
}

type School = {
    id: string;
    name: string;
    profiles: Profile[];
}
