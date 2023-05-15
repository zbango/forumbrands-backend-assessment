import { Request, Response } from "express";
import { getRepository } from "../../orm.config";
import { NotesController } from "./notes.controller";
import { Note } from "../../entities/notes.entity";

const req: Request = {} as Request;
const res: Response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
} as unknown as Response;

jest.mock("../../orm.config", () => ({
    getRepository: jest.fn(),
}));

describe("NotesController", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should return 400 if title or content is missing", async () => {
            const title = "";
            const content = "";
            req.body = { title, content };

            await NotesController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Title and content are required",
            });
            expect(getRepository).not.toHaveBeenCalled();
        });

        it("should save note and return it if title and content are provided", async () => {
            const title = "Test title";
            const content = "Test content";
            req.body = { title, content };

            const mockSave = jest.fn();
            const mockNote = {
                id: 1,
                title,
                content,
                save: mockSave,
            };
            const mockRepository = {
                save: mockSave,
            };
            (getRepository as jest.Mock).mockResolvedValueOnce(mockRepository);

            await NotesController.create(req, res);

            expect(mockNote.title).toBe(title);
            expect(mockNote.content).toBe(content);
            expect(mockSave).toHaveBeenCalled();
        });

        it("should return 500 if an error occurs while saving note", async () => {
            const title = "Test title";
            const content = "Test content";
            req.body = { title, content };

            const mockError = new Error("Test error");
            (getRepository as jest.Mock).mockRejectedValueOnce(mockError);

            await NotesController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: mockError.message,
            });
        });

        it("should return 500 if an unknown error occurs", async () => {
            const title = "Test title";
            const content = "Test content";
            req.body = { title, content };

            const mockError = "Test error";
            (getRepository as jest.Mock).mockRejectedValueOnce(mockError);

            await NotesController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Unknown error occurred",
            });
        });
    });

    describe("list", () => {
        it("should return a list of notes", async () => {
            const notes = [
                {
                    id: 1,
                    title: "Test note 1",
                    content: "Test content 1",
                },
                {
                    id: 2,
                    title: "Test note 2",
                    content: "Test content 2",
                },
            ];

            const mockFind = jest.fn().mockResolvedValue(notes);
            const mockRepository = {
                find: mockFind,
            };

            (getRepository as jest.Mock).mockResolvedValue(mockRepository);

            const jsonMock = jest.fn();
            const res = { json: jsonMock } as unknown as Response;

            await NotesController.list(req, res);

            expect(mockFind).toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith(notes);
        });

        it("should return 500 if an error occurs", async () => {
            const mockRepository = {
                find: jest.fn().mockRejectedValue(new Error("Test error")),
            };
            (getRepository as jest.Mock).mockResolvedValueOnce(mockRepository);

            await NotesController.list(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Test error",
            });
        });

        it("should return 500 if an unknown error occurs", async () => {
            const mockError = "Test error";
            (getRepository as jest.Mock).mockRejectedValueOnce(mockError);

            await NotesController.list(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Unknown error occurred",
            });
        });
    });

    describe("get", () => {
        it("should return a note if it exists", async () => {
            let note: Note = {
                id: "1",
                title: "Test note",
                content: "Test note content",
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            req.params = { id: "1" };

            const mockRepository = {
                findOne: jest.fn().mockResolvedValue(note),
            };
            (getRepository as jest.Mock).mockResolvedValue(mockRepository);

            await NotesController.get(req, res);
            expect(res.json).toHaveBeenCalledWith(note);
        });

        it("should return 404 if note does not exist", async () => {
            const mockRepository = {
                findOne: jest.fn().mockResolvedValue(null),
            };
            (getRepository as jest.Mock).mockResolvedValue(mockRepository);

            await NotesController.get(req as Request, res as Response);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Note not found",
            });
        });

        it("should return 500 if an error occurs", async () => {
            const mockRepository = {
                findOne: jest.fn().mockRejectedValue(new Error("Test error")),
            };
            (getRepository as jest.Mock).mockResolvedValue(mockRepository);

            await NotesController.get(req as Request, res as Response);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Test error",
            });
        });

        it("should return 500 if an unknown error occurs", async () => {
            const mockError = "Test error";
            (getRepository as jest.Mock).mockRejectedValueOnce(mockError);

            await NotesController.get(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Unknown error occurred",
            });
        });
    });

    describe("update", () => {
        it("should update the note and return it", async () => {
            const note = new Note();
            note.id = "1";
            note.title = "Initial Title";
            note.content = "Initial Content";
            const mockRepository = {
                findOne: jest.fn().mockResolvedValueOnce(note),
                save: jest.fn().mockResolvedValueOnce(note),
            };
            (getRepository as jest.Mock).mockResolvedValueOnce(mockRepository);

            req.body = {}

            await NotesController.update(req, res);

            expect(getRepository).toHaveBeenCalledWith(Note);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
            expect(mockRepository.save).toHaveBeenCalledWith(note);
            expect(res.json).toHaveBeenCalledWith(note);
        });

        it("should return 404 if note is not found", async () => {
            const mockRepository = {
                findOne: jest.fn().mockResolvedValueOnce(undefined),
            };
            (getRepository as jest.Mock).mockResolvedValueOnce(mockRepository);

            await NotesController.update(req, res);

            expect(getRepository).toHaveBeenCalledWith(Note);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Note not found" });
        });

        it("should return 500 if an error occurs", async () => {
            const mockRepository = {
                findOne: jest.fn().mockRejectedValue(new Error("Test error")),
            };
            (getRepository as jest.Mock).mockResolvedValueOnce(mockRepository);

            await NotesController.update(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Test error",
            });
        });


        it("should return 500 if an unknown error occurs", async () => {
            const mockRepository = {
                findOne: jest.fn().mockRejectedValueOnce("Unknown error"),
            };
            (getRepository as jest.Mock).mockResolvedValueOnce(mockRepository);

            await NotesController.update(req, res);

            expect(getRepository).toHaveBeenCalledWith(Note);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Unknown error occurred" });
        });

    });

    describe("delete", () => {
        it("should return 404 if note not found", async () => {
            req.params = { id: "1" }

            const mockRepository = {
                findOne: jest.fn().mockResolvedValueOnce(undefined),
                remove: jest.fn(),
            };

            (getRepository as jest.Mock).mockReturnValueOnce(mockRepository);

            await NotesController.delete(req, res);

            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Note not found" });
        });

        it("should delete note and return 200", async () => {
            req.params = { id: "1" }

            const noteMock = new Note();
            const mockRepository = {
                findOne: jest.fn().mockResolvedValueOnce(noteMock),
                remove: jest.fn(),
            };

            (getRepository as jest.Mock).mockReturnValueOnce(mockRepository);

            await NotesController.delete(req, res);

            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
            expect(mockRepository.remove).toHaveBeenCalledWith(noteMock);
            expect(res.json).toHaveBeenCalledWith({ message: "Note deleted" });
        });

        it("should return 500 if repository throws an error", async () => {
            req.params = { id: "1" }

            const mockRepository = {
                findOne: jest.fn().mockRejectedValueOnce(new Error("Database error")),
                remove: jest.fn(),
            };

            (getRepository as jest.Mock).mockReturnValueOnce(mockRepository);

            await NotesController.delete(req, res);

            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
        });

        it("should return 500 if an unknown error occurs", async () => {
            req.params = { id: "1" }


            const mockRepository = {
                findOne: jest.fn().mockRejectedValueOnce("Unknown error"),
                remove: jest.fn(),
            };

            (getRepository as jest.Mock).mockReturnValueOnce(mockRepository);

            await NotesController.delete(req, res);

            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Unknown error occurred" });
        });
    });
});