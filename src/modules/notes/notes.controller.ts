// You can write and export your controllers here
import { Request, Response } from "express";
import { Note } from "../../entities/notes.entity";
import { getRepository } from "../../orm.config";

export class NotesController {
	static async create(req: Request, res: Response) {
		try {
			const { title, content } = req.body;

			if (!title || !content) {
				return res
					.status(400)
					.json({ message: "Title and content are required" });
			}

			const note = new Note();
			note.title = title;
			note.content = content;

			const repository = await getRepository(Note);

			await repository.save(note);

			res.json(note);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message });
			} else {
				res.status(500).json({ message: "Unknown error occurred" });
			}
		}
	}

	static async list(req: Request, res: Response) {
		try {
			const repository = await getRepository(Note);
			const notes = await repository.find();
			res.json(notes);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message });
			} else {
				res.status(500).json({ message: "Unknown error occurred" });
			}
		}
	}

	static async get(req: Request, res: Response) {
		try {
			const id = req.params.id;
			const repository = await getRepository(Note);
			const note = await repository.findOne({ where: { id } });

			if (!note) {
				return res.status(404).json({ message: "Note not found" });
			}

			res.json(note);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message });
			} else {
				res.status(500).json({ message: "Unknown error occurred" });
			}
		}
	}

	static async update(req: Request, res: Response) {
		try {

			const id = req.params.id;
			const { title, content } = req.body;
			const repository = await getRepository(Note);
			const note = await repository.findOne({ where: { id } });

			if (!note) {
				return res.status(404).json({ message: "Note not found" });
			}

			note.title = title ?? note.title;
			note.content = content ?? note.content;
			await repository.save(note);

			res.json(note);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message });
			} else {
				res.status(500).json({ message: "Unknown error occurred" });
			}
		}
	}

	static async delete(req: Request, res: Response) {
		try {
			const id = req.params.id;
			const repository = await getRepository(Note);
			const note = await repository.findOne({ where: { id } });

			if (!note) {
				return res.status(404).json({ message: "Note not found" });
			}

			await repository.remove(note);

			res.json({ message: "Note deleted" });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message });
			} else {
				res.status(500).json({ message: "Unknown error occurred" });
			}
		}
	}
}
