export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    PostDetail: { postId: number };
    CreatePost: undefined;
    Admin: undefined;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
