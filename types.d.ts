type Post = {
    post: {
        id: string;
        content: string;
        authorId: string;
        subjectName: string;
        public: boolean;
        createdAt: string;
    };
    author: {
        id: string;
        firstName: string;
        lastName: string;
        profileImageUrl: string;
        schoolName: string;
        sameSchool: boolean;
        schoolId: string;
    };
};

type Profile = {
    id: string;
    school: School;
    schoolId: string;
    userId: string;
};

type School = {
    id: string;
    name: string;
    profiles: Profile[];
};

type Subject = {
    id: string;
    name: string;
    posts: Post[];
};
