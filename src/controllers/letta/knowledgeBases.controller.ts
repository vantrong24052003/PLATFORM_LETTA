import { Request, Response, NextFunction } from 'express';
import knowledgeBaseService from '@/services/letta/knowledgeBase.service.js';
import { renderSuccess, renderError } from '@/utils/response.helper.js';
import { HttpStatus } from '@/constants/http.constants.js';
import { KnowledgeBaseMessage } from '@/locales/index.js';

export const index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { organization_id } = req.query;
    const kbs = await knowledgeBaseService.listKnowledgeBases(organization_id as string);
    renderSuccess(res, { knowledgeBases: kbs }, KnowledgeBaseMessage.LIST_RETRIEVED);
  } catch (error) {
    renderError(res, error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, content, organization_id } = req.body;
    if (!name || !content || !organization_id) {
      return renderError(res, { statusCode: HttpStatus.BAD_REQUEST, message: KnowledgeBaseMessage.MISSING_REQUIRED_FIELDS } as any, HttpStatus.BAD_REQUEST);
    }
    const kb = await knowledgeBaseService.createKnowledgeBase({ name, description, content, organization_id });
    renderSuccess(res, { knowledgeBase: kb }, KnowledgeBaseMessage.CREATED, HttpStatus.CREATED);
  } catch (error) {
    renderError(res, error);
  }
};

export const show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) return renderError(res, { statusCode: HttpStatus.BAD_REQUEST, message: KnowledgeBaseMessage.MISSING_ID } as any, HttpStatus.BAD_REQUEST);
    const kb = await knowledgeBaseService.getKnowledgeBase(id);
    if (!kb) return renderError(res, { statusCode: HttpStatus.NOT_FOUND, message: KnowledgeBaseMessage.NOT_FOUND } as any, HttpStatus.NOT_FOUND);
    renderSuccess(res, { knowledgeBase: kb }, KnowledgeBaseMessage.RETRIEVED);
  } catch (error) {
    renderError(res, error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, content } = req.body;
    if (!id) return renderError(res, { statusCode: HttpStatus.BAD_REQUEST, message: KnowledgeBaseMessage.MISSING_ID } as any, HttpStatus.BAD_REQUEST);
    await knowledgeBaseService.updateKnowledgeBase(id, { name, description, content });
    renderSuccess(res, {}, KnowledgeBaseMessage.UPDATED);
  } catch (error) {
    renderError(res, error);
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) return renderError(res, { statusCode: HttpStatus.BAD_REQUEST, message: KnowledgeBaseMessage.MISSING_ID } as any, HttpStatus.BAD_REQUEST);
    await knowledgeBaseService.deleteKnowledgeBase(id);
    renderSuccess(res, {}, KnowledgeBaseMessage.DELETED);
  } catch (error) {
    renderError(res, error);
  }
};
