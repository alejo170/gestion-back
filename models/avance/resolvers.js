import { ModeloAvance } from './avance.js';

const resolversAvance = {
  Query: {
    Avances: async (parent, args) => {
      let filter = {}
      if(args.project){
        filter = {...args}
      }
      const avances = await ModeloAvance.find().populate('proyecto').populate('creadoPor');
      return avances;
    },
    filtrarAvance: async (parents, args) => {
      const avanceFiltrado = await ModeloAvance.find({ proyecto: args._id })
        .populate('proyecto')
        .populate('creadoPor');
      return avanceFiltrado;
    },
  },
  Mutation: {
    crearAvance: async (parents, args) => {
      const avanceCreado = ModeloAvance.create({
        fecha: args.fecha,
        descripcion: args.descripcion,
        proyecto: args.proyecto,
        creadoPor: args.creadoPor,
      });
      const avances = await ModeloAvance.find({ proyecto: avanceCreado.proyecto });

      if (avances.length === 1) {
        const proyectoModificado = await ProjectModel.findOneAndUpdate(
          { _id: avanceCreado.proyecto },
          {
            fase: 'DESARROLLO',
          }
        );
        console.log('proy modificado', proyectoModificado);
      }

      return avanceCreado;
    },
    crearObservacion: async (parent, args) => {
      const avanceModificado = await ModeloAvance.findByIdAndUpdate(
        args._id,
        {
          $addToSet:{
            observaciones: args.observacion,
          },
        },
        {new:true}
      );
      return avanceModificado;
    },

  },
};

export { resolversAvance }; 