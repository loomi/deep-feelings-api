import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Survey} from '../models';
import {SurveyRepository} from '../repositories';

export class SurveyController {
  constructor(
    @repository(SurveyRepository)
    public surveyRepository : SurveyRepository,
  ) {}

  @post('/surveys')
  @response(200, {
    description: 'Survey model instance',
    content: {'application/json': {schema: getModelSchemaRef(Survey)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Survey, {
            title: 'NewSurvey',
            exclude: ['id'],
          }),
        },
      },
    })
    survey: Omit<Survey, 'id'>,
  ): Promise<Survey> {
    return this.surveyRepository.create(survey);
  }

  @get('/surveys/count')
  @response(200, {
    description: 'Survey model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Survey) where?: Where<Survey>,
  ): Promise<Count> {
    return this.surveyRepository.count(where);
  }

  @get('/surveys')
  @response(200, {
    description: 'Array of Survey model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Survey, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Survey) filter?: Filter<Survey>,
  ): Promise<Survey[]> {
    return this.surveyRepository.find(filter);
  }

  @patch('/surveys')
  @response(200, {
    description: 'Survey PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Survey, {partial: true}),
        },
      },
    })
    survey: Survey,
    @param.where(Survey) where?: Where<Survey>,
  ): Promise<Count> {
    return this.surveyRepository.updateAll(survey, where);
  }

  @get('/surveys/{id}')
  @response(200, {
    description: 'Survey model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Survey, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Survey, {exclude: 'where'}) filter?: FilterExcludingWhere<Survey>
  ): Promise<Survey> {
    return this.surveyRepository.findById(id, filter);
  }

  @patch('/surveys/{id}')
  @response(204, {
    description: 'Survey PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Survey, {partial: true}),
        },
      },
    })
    survey: Survey,
  ): Promise<void> {
    await this.surveyRepository.updateById(id, survey);
  }

  @put('/surveys/{id}')
  @response(204, {
    description: 'Survey PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() survey: Survey,
  ): Promise<void> {
    await this.surveyRepository.replaceById(id, survey);
  }

  @del('/surveys/{id}')
  @response(204, {
    description: 'Survey DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.surveyRepository.deleteById(id);
  }
}
