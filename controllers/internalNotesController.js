const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {
  useErrorResponse,
  useSuccessResponse,
} = require('../utils/apiResponses/apiResponses');

// CRUD INTERNALNOTES
// POST User

const PostNote = async (req, res) => {
  const { profile_Id, description, owner_Id } = req.body;
  try {
    const User = await prisma.internalNotes.findMany({
      where: {
        profile_Id,
        owner_Id,
      },
    });
    if (User.length > 0) {
      return useErrorResponse(res, 'Note already exists', 400);
    }
    const internalnote = await prisma.internalNotes.create({
      data: {
        profile_Id,
        description,
        owner_Id,
      },
    });
    useSuccessResponse(res, 'Note Created Successfully', internalnote, 201);
  } catch (error) {
    console.error(error);
    useErrorResponse(res, 'Note Creating Failed', 500);
  }
};

// GET User

const GetNote = async (req, res) => {
  try {
    const Note = await prisma.internalNotes.findMany();
    useSuccessResponse(res, 'Note Getting Successfull', Note, 200);
  } catch (error) {
    useErrorResponse(res, 'Note Getting Failed', 500);
  }
};
// GetById
const GetNoteById = async (req, res) => {
  const { id } = req.params;
  try {
    const GetNoteById = await prisma.internalNotes.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    useSuccessResponse(res, 'Notes Fetched Successfull', GetNoteById, 200);
  } catch (error) {
    useErrorResponse(res, 'Notes Fetching Failed');
  }
};
// DELETE User

const DeleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteNote = await prisma.internalNotes.delete({
      where: {
        internalNotes_id: parseInt(id),
      },
    });
    useSuccessResponse(res, 'Note Delete Successfull', deleteNote, 200);
  } catch (error) {
    useErrorResponse(res, 'Note Deleting Failed', 500);
  }
};

// Edit Userx

const EditNote = async (req, res) => {
  const { id } = req.params;
  const { profile_Id, description, owner_Id } = req.body;
  try {
    const EditNote = await prisma.internalNotes.update({
      where: { internalNotes_id: parseInt(id) },
      data: {
        profile_Id: profile_Id !== undefined ? parseInt(profile_Id) : undefined,
        description: description !== undefined ? description : undefined,
        owner_Id: owner_Id !== undefined ? parseInt(owner_Id) : undefined,
      },
    });
    useSuccessResponse(res, 'Note Edit Successfull', EditNote, 200);
  } catch (error) {
    useErrorResponse(res, 'Note Edit Failed', 500);
  }
};

module.exports = {
  DeleteNote,
  EditNote,
  GetNote,
  GetNoteById,
  PostNote,
};
