module.exports = {
  fields: {
    id: {
      type: 'uuid',
      default: {
        $db_function: 'uuid()'
      }
    },
    dummy: {
      type: 'text',
      default: '1'
    },
    name: 'text',
    author: 'text',
    tags: {
      type: 'list',
      typeDef: '<text>'
    },
    photoURL: 'text',
    startingDate: 'date',
    completed: 'boolean',
    rank: 'double',
    rating: 'double',
    description: 'text'
  },
  key: [
    ['dummy'], 'rank', 'rating', 'id'
  ],
  clustering_order: {
    rank: 'asc',
    rating: 'desc'
  },
  materialized_views: {
    author_search: {
      select: ['name', 'author', 'tags', 'photoURL', 'startingDate', 'completed', 'rank', 'rating', 'description'],
      key: [
        ['author'], 'rank', 'rating', 'id', 'dummy'
      ],
      clustering_order: {
        rank: 'asc',
        rating: 'desc'
      }
    },
    all_name_search: {
      select: ['name', 'author', 'tags', 'photoURL', 'startingDate', 'completed', 'rank', 'rating', 'description'],
      key: [
        ['id'], 'name', 'rank', 'rating', 'dummy'
      ],
      clustering_order: {
        name: 'asc'
      }
    }
  },
  indexes: ['tags', 'id'],
  table_name: 'all_ranking_search'
};
