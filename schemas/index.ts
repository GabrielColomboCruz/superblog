import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1,{
        message:"Password required"
    }),

});

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6,{
        message:"Password minimum lengh 6"
    },),
    name: z.string().min(1,{
        message:"Name requiered"
    })


});