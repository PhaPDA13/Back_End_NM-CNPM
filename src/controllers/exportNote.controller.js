import { ExportNoteService } from "../services/exportNote.service.js";

export const createExportNote = async (req, res, next) => {
  try {
    const createdExportNote = await ExportNoteService.create(req.body, req.user.id);
    res.json({
      success: true,
      message: "Create export bill",
      data: createdExportNote,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllExportNotes = async (req, res, next) => {
  try {
    const exportNotes = await ExportNoteService.getAll(req.user.id);
    res.json({
      success: true,
      message: "Get all export bills",
      data: exportNotes,
    });
  } catch (err) {
    next(err);
  }
};

export const getExportNoteById = async (req, res, next) => {
  try {
    const exportNoteId = parseInt(req.params.id, 10);
    const foundExportNote = await ExportNoteService.getById(exportNoteId, req.user.id);
    res.json({
      success: true,
      message: "Get export bill by id",
      data: foundExportNote,
    });
  } catch (err) {
    next(err);
  }
};
