import {withAuth} from 'next-auth/middleware';

export default withAuth({
    pages:{
        signIn:"/login"
    },
    callbacks:{
        async authorized({token}){
            if(!!token){
                console.log('authenticated');
            }
            else{
                console.log('unauthenticated');
            }

            return !!token;
        },
    },
});




export const config = {
    matcher:[
        "/dashboard/:path*",
        "/conversations/:path*",
        
    ]
}