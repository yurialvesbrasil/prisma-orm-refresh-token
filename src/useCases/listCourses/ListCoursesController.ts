import { Controller, Get, Middleware } from "@overnightjs/core/lib/decorators";
import { BaseController } from "../BaseController";
import { Request, Response } from 'express';
import { authMiddleware } from "@src/middlewares/auth";

@Controller('courses')
export class ListCoursesController extends BaseController {
    @Get()
    @Middleware([authMiddleware]) /* Rota segura */
    async handleListCourses(_: Request, response: Response) {
        try {
            return response.status(200).json([
                { id: 1, name: "NodeJS" },
                { id: 2, name: "NextJS" },
                { id: 3, name: "Windows 11" },
                { id: 4, name: "TypeScript" },
            ]);
        } catch (error) {
            return this.sendErrorResponse(response, {
                message: `${error.message}`,
                description: `${error.description}`,
                code: 500,
            });
        }
    }
}