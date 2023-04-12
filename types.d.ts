type Post = {
    post: {
        id: string;
        content: string;
        authorId: string;
        createdAt: string;
    };
    author: {
        id: string;
        firstName: string;
        lastName: string;
        profileImageUrl: string;
    };
};
