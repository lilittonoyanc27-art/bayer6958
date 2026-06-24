export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface Question {
  id: string;
  category: 'journey' | 'school' | 'imperative' | 'past' | 'future';
  dialogue: DialogueLine[];
  maskedIndex: number; // Index of the dialogue line containing the blank
  blankWord: string; // The word replaced with '___'
  options: string[]; // 4 options
  correctIndex: number; // Index of the correct option (0-3)
  translation: string; // Armenian translation of the whole dialogue
  explanation: string; // Grammatical or vocabulary explanation in Armenian
  difficulty: 'հեշտ' | 'միջին' | 'դժվար';
}

export const CATEGORIES = [
  { id: 'journey', name: 'Ճանապարհորդություն Իսպանիայում', icon: 'Plane', description: 'Երկխոսություններ օդանավակայանում, հյուրանոցում, սրճարանում և տրանսպորտում:' },
  { id: 'school', name: 'Դպրոցական կյանք', icon: 'GraduationCap', description: 'Երկխոսություն դպրոցում, դասի ժամանակ, ընկերների և ուսուցիչների հետ:' },
  { id: 'imperative', name: 'Հրամայական եղանակ (Imperative)', icon: 'MessageSquareMessage', description: 'Երկխոսություններ imperativo-ով՝ հրամաններ, խորհուրդներ և արգելքներ:' },
  { id: 'past', name: 'Անցյալ ժամանակներ', icon: 'CalendarDays', description: 'Pretérito perfecto, indefinido, imperfecto և pluscuamperfecto ժամանակաձևեր:' },
  { id: 'future', name: 'Ապագա ժամանակ', icon: 'Sparkles', description: 'Futuro simple ժամանակաձևի երկխոսություններ և պլաններ:' }
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

export const QUESTIONS: Question[] = [
  // ================= CATEGORY 1: JOURNEY (ՃԱՆԱՊԱՐՀՈՐԴՈՒԹՅՈՒՆ ԻՍՊԱՆԻԱՅՈՒՄ) =================
  {
    id: 'j1',
    category: 'journey',
    dialogue: [
      { speaker: 'Camarero', text: 'Buenos días, ¿qué desea tomar?' },
      { speaker: 'Cliente', text: 'Quiero un ___, por favor.' }
    ],
    maskedIndex: 1,
    blankWord: 'agua',
    options: ['mesa', 'agua', 'puerta', 'camisa'],
    correctIndex: 1,
    translation: 'Մատուցող․ Բարի օր, ի՞նչ եք ցանկանում խմել։\nՀաճախորդ․ Ես ուզում եմ մեկ ջուր, խնդրում եմ։',
    explanation: '«tomar» բայը այս համատեքստում նշանակում է խմել, իսկ «agua»-ն (ջուր) միակ համապատասխան խմիչքն է տարբերակներում:',
    difficulty: 'հեշտ'
  },
  {
    id: 'j2',
    category: 'journey',
    dialogue: [
      { speaker: 'Recepcionista', text: 'Buenas tardes, ¿tiene una reserva?' },
      { speaker: 'Turista', text: 'Sí, tengo una reserva a ___ de Ana.' }
    ],
    maskedIndex: 1,
    blankWord: 'nombre',
    options: ['nombre', 'coche', 'comida', 'calle'],
    correctIndex: 0,
    translation: 'Ադմինիստրատոր․ Բարի կեսօր, ունե՞ք ամրագրում։\nԶբոսաշրջիկ․ Այո, ես ունեմ ամրագրում Աննայի անունով։',
    explanation: '«a nombre de...» կառույցը իսպաներենում նշանակում է «ինչ-որ մեկի անունով»:',
    difficulty: 'հեշտ'
  },
  {
    id: 'j3',
    category: 'journey',
    dialogue: [
      { speaker: 'Turista', text: 'Perdón, ¿dónde está la ___ de autobús?' },
      { speaker: 'Persona', text: 'Está al lado del supermercado.' }
    ],
    maskedIndex: 0,
    blankWord: 'parada',
    options: ['parada', 'maleta', 'ventana', 'comida'],
    correctIndex: 0,
    translation: 'Զբոսաշրջիկ․ Ներողություն, որտե՞ղ է ավտոբուսի կանգառը։\nԱնցորդ․ Այն սուպերմարկետի կողքին է։',
    explanation: '«parada de autobús» նշանակում է «ավտոբուսի կանգառ»: Մյուս բառերն են՝ maleta (ճամպրուկ), ventana (պատուհան), comida (ուտելիք):',
    difficulty: 'հեշտ'
  },
  {
    id: 'j4',
    category: 'journey',
    dialogue: [
      { speaker: 'Pasajero', text: '¿A qué ___ sale el vuelo para Madrid?' },
      { speaker: 'Agente', text: 'Sale a las tres y media de la tarde.' }
    ],
    maskedIndex: 0,
    blankWord: 'hora',
    options: ['tren', 'precio', 'hora', 'maleta'],
    correctIndex: 2,
    translation: 'Ուղևոր․ Ո՞ր ժամին է մեկնում Մադրիդի թռիչքը։\nԳործակալ․ Այն մեկնում է ցերեկը ժամը երեք անց կեսին։',
    explanation: '«¿A qué hora...?» հարցական կառույցն օգտագործվում է ժամը հարցնելու համար («որ ժամի՞ն»):',
    difficulty: 'հեշտ'
  },
  {
    id: 'j5',
    category: 'journey',
    dialogue: [
      { speaker: 'Turista', text: 'Hola, ¿cuánto cuesta el ___ de metro?' },
      { speaker: 'Empleado', text: 'Cuesta dos euros y medio.' }
    ],
    maskedIndex: 0,
    blankWord: 'billete',
    options: ['vuelo', 'billete', 'coche', 'andén'],
    correctIndex: 1,
    translation: 'Զբոսաշրջիկ․ Ողջույն, ինչքա՞ն արժե մետրոյի տոմսը։\nԱշխատակից․ Այն արժե երկուս ու կես եվրո։',
    explanation: 'Իսպանիայում տրանսպորտի տոմսի համար օգտագործվում է «billete» բառը (մետրոյի / գնացքի տոմս):',
    difficulty: 'միջին'
  },
  {
    id: 'j6',
    category: 'journey',
    dialogue: [
      { speaker: 'Cliente', text: 'Camarero, ¿me trae la ___, por favor?' },
      { speaker: 'Camarero', text: 'Sí, un momento. Ahora mismo se la traigo.' }
    ],
    maskedIndex: 0,
    blankWord: 'cuenta',
    options: ['carta', 'propina', 'mesa', 'cuenta'],
    correctIndex: 3,
    translation: 'Հաճախորդ․ Մատուցող, կբերե՞ք հաշիվը, խնդրում եմ։\nՄատուցող․ Այո, մեկ վայրկյան։ Հիմա կբերեմ։',
    explanation: 'Ռեստորանում կամ սրճարանում հաշիվը խնդրում են «la cuenta» բառով: «Carta»-ն մենյուն է, «propina»-ն՝ թեյավճարը:',
    difficulty: 'միջին'
  },
  {
    id: 'j7',
    category: 'journey',
    dialogue: [
      { speaker: 'Turista', text: '¿Este autobús va ___ al centro histórico?' },
      { speaker: 'Conductor', text: 'No, este va al aeropuerto, tiene que tomar la línea 3.' }
    ],
    maskedIndex: 0,
    blankWord: 'directo',
    options: ['lejos', 'cerca', 'directo', 'tarde'],
    correctIndex: 2,
    translation: 'Զբոսաշրջիկ․ Այս ավտոբուսը ուղիղ գնո՞ւմ է պատմական կենտրոն։\nՎարորդ․ Ոչ, սա գնում է օդանավակայան, դուք պետք է նստեք 3-րդ գիծը։',
    explanation: '«va directo a...» նշանակում է ուղիղ գնալ դեպի ինչ-որ տեղ: Այստեղ խոսքը ուղիղ երթուղու մասին է:',
    difficulty: 'դժվար'
  },
  {
    id: 'j8',
    category: 'journey',
    dialogue: [
      { speaker: 'Turista', text: '¿Tiene habitaciones ___ para este fin de semana?' },
      { speaker: 'Recepcionista', text: 'Lo siento, estamos completos por el festival.' }
    ],
    maskedIndex: 0,
    blankWord: 'libres',
    options: ['limpias', 'caras', 'libres', 'cerradas'],
    correctIndex: 2,
    translation: 'Զբոսաշրջիկ․ Այս հանգստյան օրերին ազատ սենյակներ ունե՞ք։\nԱդմինիստրատոր․ Ցավում եմ, բոլորը զբաղված են փառատոնի պատճառով։',
    explanation: '«habitaciones libres» նշանակում է «ազատ սենյակներ» (հյուրանոցում): «Completos» նշանակում է, որ ամբողջությամբ զբաղված է:',
    difficulty: 'դժվար'
  },

  // ================= CATEGORY 2: SCHOOL LIFE (ԴՊՐՈՑԱԿԱՆ ԿՅԱՆՔ) =================
  {
    id: 's1',
    category: 'school',
    dialogue: [
      { speaker: 'Lucas', text: '¿A qué hora empieza la examen de inglés?' },
      { speaker: 'Sofía', text: 'Empieza a las diez, tenemos que ___ al aula ahora.' }
    ],
    maskedIndex: 1,
    blankWord: 'entrar',
    options: ['estudiar', 'entrar', 'escribir', 'comer'],
    correctIndex: 1,
    translation: 'Լուկաս․ Ժամը քանիսի՞ն է սկսվում անգլերենի քննությունը։\nՍոֆիա․ Սկսվում է տասին, մենք պետք է հիմա մտնենք դասարան։',
    explanation: '«entrar al aula» նշանակում է «մտնել լսարան/դասարան»։ «Entrar» բայը պահանջում է «a» նախդիրը։',
    difficulty: 'հեշտ'
  },
  {
    id: 's2',
    category: 'school',
    dialogue: [
      { speaker: 'Profesor', text: '¿Quién ha hecho la tarea de español?' },
      { speaker: 'Diego', text: 'Yo la he ___, profesor. Aquí la tiene.' }
    ],
    maskedIndex: 1,
    blankWord: 'hecho',
    options: ['hecho', 'leído', 'visto', 'perdido'],
    correctIndex: 0,
    translation: 'Ուսուցիչ․ Ո՞վ է արել իսպաներենի տնային աշխատանքը։\nԴիեգո․ Ես այն արել եմ, պարո՛ն ուսուցիչ։ Ահա այն։',
    explanation: '«Hacer» բայի Pretértito Perfecto-ի անկանոն դերբայը (participio) «hecho»-ն է (he hecho = արել եմ):',
    difficulty: 'հեշտ'
  },
  {
    id: 's3',
    category: 'school',
    dialogue: [
      { speaker: 'Marta', text: '¿Me dejas un ___ para escribir?' },
      { speaker: 'Carlos', text: 'Sí, toma. Tengo un bolígrafo azul y uno negro.' }
    ],
    maskedIndex: 0,
    blankWord: 'bolígrafo',
    options: ['libro', 'cuaderno', 'bolígrafo', 'borrador'],
    correctIndex: 2,
    translation: 'Մարտա․ Ինձ գրելու գրի՞չ կտաս։\nԿառլոս․ Այո, վերցրու։ Ունեմ կապույտ և սև գրիչ։',
    explanation: 'Գրելու համար պետք է «bolígrafo» (գրիչ)։ Կառլոսի պատասխանի մեջ հենց «bolígrafo» բառն է նշված:',
    difficulty: 'հեշտ'
  },
  {
    id: 's4',
    category: 'school',
    dialogue: [
      { speaker: 'Mateo', text: '¿Qué ___ estudias hoy para el examen de historia?' },
      { speaker: 'Elena', text: 'Estudio el tema número cuatro, la Edad Media.' }
    ],
    maskedIndex: 0,
    blankWord: 'tema',
    options: ['tema', 'pizarra', 'colegio', 'recreo'],
    correctIndex: 0,
    translation: 'Մատեո․ Պատմության քննության համար այսօր ո՞ր թեման ես սովորում։\nԵլենա․ Սովորում եմ չորրորդ թեման՝ Միջնադարը։',
    explanation: 'Ելենայի պատասխանում նշված է «el tema número cuatro»: Հետևաբար հարցի մեջ պետք է լինի «tema» (թեմա):',
    difficulty: 'միջին'
  },
  {
    id: 's5',
    category: 'school',
    dialogue: [
      { speaker: 'Alumna', text: 'Profesor, ¿puedo ir al ___ por favor?' },
      { speaker: 'Profesor', text: 'Sí, pero vuelve rápido que vamos a empezar la actividad.' }
    ],
    maskedIndex: 0,
    blankWord: 'servicio',
    options: ['recreo', 'gimnasio', 'pizarrón', 'servicio'],
    correctIndex: 3,
    translation: 'Աշակերտուհի․ Պարո՛ն ուսուցիչ, կարո՞ղ եմ գնալ զուգարան, խնդրում եմ։\nՈւսուցիչ․ Այո, բայց արագ վերադարձիր, քանի որ սկսում ենք աշխատանքը։',
    explanation: 'Դպրոցում կամ հանրային վայրում զուգարան գնալու թույլտվություն խնդրելիս ասում են «ir al servicio» կամ «ir al baño»:',
    difficulty: 'միջին'
  },
  {
    id: 's6',
    category: 'school',
    dialogue: [
      { speaker: 'Laura', text: '¿Has ___ la mochila?' },
      { speaker: 'Pedro', text: 'Sí, ya tengo los libros, el estuche y mi bocadillo.' }
    ],
    maskedIndex: 0,
    blankWord: 'preparado',
    options: ['perdido', 'preparado', 'comido', 'abierto'],
    correctIndex: 1,
    translation: 'Լաուրա․ Պատրաստե՞լ ես պայուսակդ։\nՊեդրո․ Այո, արդեն վերցրել եմ գրքերը, գրչատուփը և բուտերբրոդս։',
    explanation: 'Pedro-ի պատասխանը ցույց է տալիս, որ նախապատրաստական աշխատանքը կատարված է, այսինքն՝ «preparar la mochila» (պատրաստել պայուսակը):',
    difficulty: 'միջին'
  },
  {
    id: 's7',
    category: 'school',
    dialogue: [
      { speaker: 'Juan', text: '¿Qué nota has ___ en el examen de geografía?' },
      { speaker: 'Sara', text: 'He sacado un ocho, ¡estoy muy feliz!' }
    ],
    maskedIndex: 0,
    blankWord: 'sacado',
    options: ['hecho', 'leído', 'sacado', 'puesto'],
    correctIndex: 2,
    translation: 'Խուան․ Ի՞նչ գնահատական ես ստացել աշխարհագրության քննությունից։\nՍառա․ Ութ եմ ստացել, շատ երջանիկ եմ։',
    explanation: 'Իսպաներենում «գնահատական ստանալ» արտահայտվում է «sacar una nota» կառույցով։ Pretértito perfecto-ում՝ «he sacado»:',
    difficulty: 'դժվար'
  },
  {
    id: 's8',
    category: 'school',
    dialogue: [
      { speaker: 'Profesor', text: 'Silencio, chicos. Tenéis que ___ atención a las explicaciones.' },
      { speaker: 'Alumnos', text: 'Sí, perdón profesor.' }
    ],
    maskedIndex: 0,
    blankWord: 'prestar',
    options: ['hacer', 'prestar', 'tomar', 'mirar'],
    correctIndex: 1,
    translation: 'Ուսուցիչ․ Լռությո՛ւն, երեխաներ։ Դուք պետք է ուշադրություն դարձնեք բացատրություններին։\nԱշակերտներ․ Այո, ներեցեք, պարոն ուսուցիչ:',
    explanation: '«Ուշադրություն դարձնել / լսել» իսպաներենում կոչվում է «prestar atención»:',
    difficulty: 'դժվար'
  },

  // ================= CATEGORY 3: IMPERATIVE / ՀՐԱՄԱՅԱԿԱՆ ԵՂԱՆԱԿ =================
  {
    id: 'i1',
    category: 'imperative',
    dialogue: [
      { speaker: 'Profesor', text: 'Chicos, ___ el libro en la página diez.' },
      { speaker: 'Alumnos', text: 'Vale, profesor.' }
    ],
    maskedIndex: 0,
    blankWord: 'abrid',
    options: ['abrid', 'abre', 'abro', 'abrir'],
    correctIndex: 0,
    translation: 'Ուսուցիչ․ Երեխաներ, բացեք գիրքը տասներորդ էջի վրա։\nԱշակերտներ․ Լավ, պարո՛ն ուսուցիչ։',
    explanation: '«chicos»-ը հոգնակի երկրորդ դեմք է (vosotros), հետևաբար «abrir» բայի հրամայականը կլինի «abrid»:',
    difficulty: 'հեշտ'
  },
  {
    id: 'i2',
    category: 'imperative',
    dialogue: [
      { speaker: 'Madre', text: 'Andrés, ___ la televisión y ponte a estudiar.' },
      { speaker: 'Andrés', text: 'Dos minutos más, mamá, por favor.' }
    ],
    maskedIndex: 0,
    blankWord: 'apaga',
    options: ['apaguen', 'apaga', 'apagas', 'apaguen'],
    correctIndex: 1,
    translation: 'Մայրիկ․ Անդրես, անջատիր հեռուստացույցը և նստիր սովորելու։\nԱնդրես․ Եվս երկու րոպե, մայրիկ, խնդրում եմ։',
    explanation: 'Անդրեսին դիմում են եզակի «tú»-ով, հետևաբար «apagar» բայի հրամայական ձևն է՝ «apaga»:',
    difficulty: 'հեշտ'
  },
  {
    id: 'i3',
    category: 'imperative',
    dialogue: [
      { speaker: 'Amigo', text: '¡___ rápido! El autobús ya está llegando.' },
      { speaker: 'Yo', text: '¡Ya voy, ya casi estoy ahí!' }
    ],
    maskedIndex: 0,
    blankWord: 'Corre',
    options: ['Corro', 'Corre', 'Corran', 'Correr'],
    correctIndex: 1,
    translation: 'Ընկեր․ Արագ վազի՛ր։ Ավտոբուսն արդեն հասնում է։\nԵս․ Հիմա գալիս եմ, համարյա տեղում եմ։',
    explanation: '«Correr» բայի հրամայական ձևն է եզակի «tú»-ի համար՝ «corre»:',
    difficulty: 'հեշտ'
  },
  {
    id: 'i4',
    category: 'imperative',
    dialogue: [
      { speaker: 'Padre', text: 'Hijo, no ___ mentiras, siempre di la verdad.' },
      { speaker: 'Hijo', text: 'Sí papá, te lo prometo.' }
    ],
    maskedIndex: 0,
    blankWord: 'digas',
    options: ['di', 'digas', 'dices', 'decir'],
    correctIndex: 1,
    translation: 'Հայրիկ․ Որդիս, սուտ մի՛ ասա, միշտ ճշմարտությունն ասա։\nՈրդի․ Այո հայրիկ, խոստանում եմ։',
    explanation: 'Ժխտական հրամայականի դեպքում (Subjuntivo) «decir» բանը «tú» դեմքի համար դառնում է «no digas»:',
    difficulty: 'միջին'
  },
  {
    id: 'i5',
    category: 'imperative',
    dialogue: [
      { speaker: 'Profesor', text: 'Sofía, ___ la pizarra, por favor.' },
      { speaker: 'Sofía', text: 'Sí, claro. ¿Dónde está el borrador?' }
    ],
    maskedIndex: 0,
    blankWord: 'limpia',
    options: ['limpie', 'limpias', 'limpia', 'limpiar'],
    correctIndex: 2,
    translation: 'Ուսուցիչ․ Սոֆիա, մաքրիր գրատախտակը, խնդրում եմ։\nՍոֆիա․ Այո, իհարկե։ Որտե՞ղ է ջնջիչը։',
    explanation: '«limpiar» բայի հրամայական ձևն է եզակի «tú» դեմքում՝ «limpia»։',
    difficulty: 'միջին'
  },
  {
    id: 'i6',
    category: 'imperative',
    dialogue: [
      { speaker: 'Médico', text: 'Señor García, no ___ café antes de dormir.' },
      { speaker: 'Paciente', text: 'Está bien, doctor. Tomaré té de manzanilla.' }
    ],
    maskedIndex: 1,
    blankWord: 'tome',
    options: ['tomas', 'tome', 'toma', 'tomen'],
    correctIndex: 1,
    translation: 'Բժիշկ․ Պարոն Գարսիա, քնելուց առաջ սուրճ մի՛ խմեք։\nՀիվանդ․ Լավ, բժիշկ։ Երիցուկի թեյ կխմեմ։',
    explanation: '«Señor García»-ն հարգական դիմելաձև է (usted): Ժխտական հրամայականը usted դեմքով կլինի «no tome»:',
    difficulty: 'միջին'
  },
  {
    id: 'i7',
    category: 'imperative',
    dialogue: [
      { speaker: 'Guía', text: 'Turistas, por favor ___ las instrucciones de seguridad.' },
      { speaker: 'Turistas', text: 'Sí, estamos prestando atención.' }
    ],
    maskedIndex: 0,
    blankWord: 'escuchen',
    options: ['escucha', 'escuchad', 'escuchen', 'escuchas'],
    correctIndex: 2,
    translation: 'Գիդ․ Զբոսաշրջիկնե՛ր, խնդրում եմ լսեք անվտանգության հրահանգները։\nԶբոսաշրջիկներ․ Այո, մենք լսում ենք ուշադիր։',
    explanation: 'Հարգական հոգնակի դիմելաձևի համար (ustedes) «escuchar» բայի հրամայական ձևը «escuchen» է:',
    difficulty: 'դժվար'
  },
  {
    id: 'i8',
    category: 'imperative',
    dialogue: [
      { speaker: 'Madre', text: 'Hijos, ¡___ los platos ahora mismo!' },
      { speaker: 'Hijos', text: 'Vale, mamá, los lavamos después de este capítulo.' }
    ],
    maskedIndex: 0,
    blankWord: 'lavad',
    options: ['lava', 'lavad', 'laven', 'lavan'],
    correctIndex: 1,
    translation: 'Մայրիկ․ Երեխանե՛ր, լվացեք ամանները հենց հիմա։\nԵրեխաներ․ Լավ, մայրիկ, կլվանանք այս սերիայից հետո։',
    explanation: 'Իսպանիայում հոգնակի «hijos»-ին (vosotros) դիմելիս հրամայական ձևն է՝ բայի հիմքին + d, այսինքն՝ «lavad»:',
    difficulty: 'դժվար'
  },

  // ================= CATEGORY 4: PAST TENSE / ԱՆՑՅԱԼ ԺԱՄԱՆԱԿՆԵՐ =================
  {
    id: 'p1',
    category: 'past',
    dialogue: [
      { speaker: 'Amiga', text: '¿Qué hiciste ayer?' },
      { speaker: 'Yo', text: 'Ayer ___ al cine con mi hermano.' }
    ],
    maskedIndex: 1,
    blankWord: 'fui',
    options: ['voy', 'fui', 'he ido', 'iba'],
    correctIndex: 1,
    translation: 'Ընկերուհի․ Ի՞նչ արեցիր երեկ։\nԵս․ Երեկ եղբորս հետ կինո գնացի։',
    explanation: '«Ayer» (երեկ) բառի առկայությունը պահանջում է Pretérito Indefinido (fui) ժամանակաձևը, քանի որ գործողությունը սահմանափակված է անցյալով:',
    difficulty: 'հեշտ'
  },
  {
    id: 'p2',
    category: 'past',
    dialogue: [
      { speaker: 'Carlos', text: '¿Ya has desayunado hoy?' },
      { speaker: 'Marta', text: 'Sí, hoy ___ un cruasán delicioso.' }
    ],
    maskedIndex: 1,
    blankWord: 'he comido',
    options: ['comí', 'he comido', 'comía', 'comeré'],
    correctIndex: 1,
    translation: 'Կառլոս․ Այսօր արդեն նախաճաշե՞լ ես։\nՄարտա․ Այո, այսօր ես համեղ կրուասան եմ կերել։',
    explanation: 'Քանի որ գործողությունը տեղի է ունեցել այսօր (hoy), օգտագործվում է Pretérito Perfecto ժամանակաձևը (he + comido):',
    difficulty: 'հեշտ'
  },
  {
    id: 'p3',
    category: 'past',
    dialogue: [
      { speaker: 'Abuelo', text: 'Cuando yo ___ joven, no había teléfonos móviles.' },
      { speaker: 'Nieto', text: '¡Increíble abuelo! ¿Y cómo hablabas con tus amigos?' }
    ],
    maskedIndex: 0,
    blankWord: 'era',
    options: ['fui', 'he sido', 'era', 'seré'],
    correctIndex: 2,
    translation: 'Պապիկ․ Երբ ես երիտասարդ էի, բջջային հեռախոսներ չկային։\nԹոռնիկ․ Անհավանական է, պապի՛կ։ Իսկ ինչպե՞ս էիր խոսում ընկերներիդ հետ։',
    explanation: 'Անցյալում նկարագրության համար (երիտասարդ լինելը, անորոշ տևողությամբ) օգտագործվում է Pretérito Imperfecto (ser -> era):',
    difficulty: 'հեշտ'
  },
  {
    id: 'p4',
    category: 'past',
    dialogue: [
      { speaker: 'Héctor', text: '¿Por qué no viniste a mi fiesta el sábado pasado?' },
      { speaker: 'Inés', text: 'Es que ___ que estudiar mucho para química.' }
    ],
    maskedIndex: 1,
    blankWord: 'tuve',
    options: ['tenía', 'tuve', 'he tenido', 'tengo'],
    correctIndex: 1,
    translation: 'Հեկտոր․ Ինչո՞ւ չեկար իմ խնջույքին անցած շաբաթ օրը։\nԻնես․ Որովհետև ես ստիպված էի շատ սովորել քիմիայի համար։',
    explanation: 'Սահմանափակ ժամանակահատվածում (անցած շաբաթ օրը) կատարված կոնկրետ գործողության համար (ստիպված լինել) օգտագործվում է Pretérito Indefinido (tener -> tuve):',
    difficulty: 'միջին'
  },
  {
    id: 'p5',
    category: 'past',
    dialogue: [
      { speaker: 'Luis', text: '¿Dónde ___ tus vacaciones el verano pasado?' },
      { speaker: 'Ana', text: 'Fui a Mallorca y me bañé en el mar todos los días.' }
    ],
    maskedIndex: 0,
    blankWord: 'pasaste',
    options: ['pasaste', 'has pasado', 'pasabas', 'pasa'],
    correctIndex: 0,
    translation: 'Լուիս․ Որտե՞ղ անցկացրեցիր անցած ամառային արձակուրդդ։\nԱնա․ MALLORCA գնացի և ամեն օր ծովում լողում էի։',
    explanation: '«el verano pasado» (անցյալ ամառ) հստակ ժամանակի ցուցիչ է, որի համար պահանջվում է Pretérito Indefinido («pasaste»):',
    difficulty: 'միջին'
  },
  {
    id: 'p6',
    category: 'past',
    dialogue: [
      { speaker: 'Sofía', text: 'Cuando llegué a la estación, el tren ya ___.' },
      { speaker: 'Pedro', text: '¡Qué mala suerte! ¿Tuviste que esperar al siguiente?' }
    ],
    maskedIndex: 0,
    blankWord: 'había salido',
    options: ['ha salido', 'salió', 'había salido', 'salía'],
    correctIndex: 2,
    translation: 'Սոֆիա․ Երբ ես կայարան հասա, գնացքն արդեն մեկնել էր։\nՊեդրո․ Ինչպիսի՜ ձախորդություն։ Ստիպված եղար հաջորդի՞ն սպասել։',
    explanation: 'Քանի որ գնացքը մեկնել էր նախքան կայարան հասնելը (անցյալում կատարված գործողությունից ավելի վաղ), օգտագործվում է Pretérito Pluscuamperfecto (había + salido):',
    difficulty: 'դժվար'
  },
  {
    id: 'p7',
    category: 'past',
    dialogue: [
      { speaker: 'Juan', text: '¿Qué ___ haciendo cuando empezó a llover tan fuerte?' },
      { speaker: 'María', text: 'Estábamos jugando al fútbol en el parque.' }
    ],
    maskedIndex: 0,
    blankWord: 'estabais',
    options: ['estuvisteis', 'estabais', 'habéis estado', 'estáis'],
    correctIndex: 1,
    translation: 'Խուան․ Ի՞նչ էիք անում, երբ սկսեց այդքան ուժեղ անձրևել։\nՄարիա․ Մենք զբոսայգում ֆուտբոլ էինք խաղում։',
    explanation: 'Անցյալում ընթացող երկարատև գործողությունը նկարագրելիս, երբ այն ընդհատվում է մեկ այլ գործողությամբ, օգտագործվում է Imperfecto (`estabais`):',
    difficulty: 'դժվար'
  },
  {
    id: 'p8',
    category: 'past',
    dialogue: [
      { speaker: 'Hijo', text: 'Mamá, ¿cómo se conocieron tú y papá?' },
      { speaker: 'Madre', text: 'Nos conocimos en París, donde yo ___ francés.' }
    ],
    maskedIndex: 1,
    blankWord: 'estudiaba',
    options: ['estudié', 'he estudiado', 'estudiaba', 'estudiaré'],
    correctIndex: 2,
    translation: 'Որդի․ Մայրիկ, ինչպե՞ս եք դու և հայրիկը ծանոթացել։\nՄայրիկ․ Մենք ծանոթացել ենք Փարիզում, որտեղ ես ֆրանսերեն էի սովորում (այդ ժամանակահատվածում):',
    explanation: 'Սովորելը ծանոթանալու պահին տևական ֆոնային գործողություն էր անցյալում, ուստի օգտագործվում է Pretérito Imperfecto (estudiaba):',
    difficulty: 'դժվար'
  },

  // ================= CATEGORY 5: FUTURE TENSE / ԱՊԱԳԱ ԺԱՄԱՆԱԿ =================
  {
    id: 'f1',
    category: 'future',
    dialogue: [
      { speaker: 'Hijo', text: '¿Dónde ___ las vacaciones de verano, papá?' },
      { speaker: 'Padre', text: 'Iremos a España para visitar Barcelona.' }
    ],
    maskedIndex: 0,
    blankWord: 'pasaremos',
    options: ['pasamos', 'pasaremos', 'pasamos', 'pasaron'],
    correctIndex: 1,
    translation: 'Որդի․ Որտե՞ղ ենք անցկացնելու ամառային արձակուրդները, հայրի՛կ։\nՀայրիկ․ Կգնանք Իսպանիա՝ Բարսելոնան այցելելու համար։',
    explanation: 'Հաջորդ արձակուրդների պլանների մասին խոսելիս օգտագործվում է Futuro Simple (pasaremos = կանցկացնենք):',
    difficulty: 'հեշտ'
  },
  {
    id: 'f2',
    category: 'future',
    dialogue: [
      { speaker: 'Sofía', text: '¿Qué ___ cuando termines el colegio?' },
      { speaker: 'Lucas', text: 'Estudiaré medicina en la universidad de Madrid.' }
    ],
    maskedIndex: 0,
    blankWord: 'harás',
    options: ['haces', 'hiciste', 'harás', 'haría'],
    correctIndex: 2,
    translation: 'Սոֆիա․ Ի՞նչ ես անելու, երբ ավարտես դպրոցը։\nԼուկաս․ Բժշկություն կսովորեմ Մադրիդի համալսարանում։',
    explanation: '«hacer» բայի Futuro ձևն է «harás» (դու կանես)։ Լուկասը պատասխանում է «estudiaré» (կսովորեմ):',
    difficulty: 'հեշտ'
  },
  {
    id: 'f3',
    category: 'future',
    dialogue: [
      { speaker: 'Amigo', text: '¿Vienes con nosotros al parque esta tarde?' },
      { speaker: 'Yo', text: 'No puedo, ___ en casa porque tengo que estudiar.' }
    ],
    maskedIndex: 1,
    blankWord: 'me quedaré',
    options: ['quedo', 'me quedé', 'me quedaré', 'quedarme'],
    correctIndex: 2,
    translation: 'Ընկեր․ Այսօր կեսօրին գալի՞ս ես մեզ հետ զբոսայգի։\nԵս․ Չեմ կարող, տանը կմնամ, քանի որ պետք է սովորեմ։',
    explanation: '«Կմնամ» ապագա պլան է «me quedaré» (Futuro Simple):',
    difficulty: 'հեշտ'
  },
  {
    id: 'f4',
    category: 'future',
    dialogue: [
      { speaker: 'Jefe', text: '¿Cuándo terminarás el informe para el cliente?' },
      { speaker: 'Empleada', text: 'Lo ___ mañana por la mañana sin falta.' }
    ],
    maskedIndex: 1,
    blankWord: 'haré',
    options: ['hice', 'mira', 'haré', 'Hago'],
    correctIndex: 2,
    translation: 'Ղեկավար․ Ե՞րբ կավարտես հաշվետվությունը հաճախորդի համար։\nԱշխատակից․ Այն կանեմ վաղը առավոտյան անպայման։',
    explanation: '«Hacer» բայի Futuro Simple-ի առաջին դեմքն է «haré» (ես կանեմ): Մյուս տարբերակները տարբեր ժամանակներ են:',
    difficulty: 'միջին'
  },
  {
    id: 'f5',
    category: 'future',
    dialogue: [
      { speaker: 'Madre', text: 'Creo que mañana lloverá en la ciudad.' },
      { speaker: 'Hijo', text: 'Entonces ___ el paraguas por si acaso.' }
    ],
    maskedIndex: 1,
    blankWord: 'llevaré',
    options: ['llevo', 'llevaré', 'llevé', 'llevaría'],
    correctIndex: 1,
    translation: 'Մայրիկ․ Կարծում եմ՝ վաղը քաղաքում անձրև կգա։\nՈրդի․ Ուրեմն հովանոց կվերցնեմ ամեն դեպքում։',
    explanation: 'Վաղվա իրադարձության համար որոշում կայացնելիս՝ կվերցնեմ՝ «llevaré» (Futuro Simple):',
    difficulty: 'միջին'
  },
  {
    id: 'f6',
    category: 'future',
    dialogue: [
      { speaker: 'Marta', text: '¿Cuándo vendrán tus tíos de Argentina?' },
      { speaker: 'Inés', text: 'Ellos ___ en avión el próximo martes.' }
    ],
    maskedIndex: 1,
    blankWord: 'llegarán',
    options: ['llegan', 'llegarán', 'llegaron', 'llegaban'],
    correctIndex: 1,
    translation: 'Մարտա․ Ե՞րբ կգան քո հորեղբայրները Արգենտինայից։\nԻնես․ Նրանք ինքնաթիռով կժամանեն հաջորդ երեքշաբթի։',
    explanation: '«El próximo martes» (հաջորդ երեքշաբթի) արտահայտությունը պահանջում է Futuro Simple («llegarán» - նրանք կժամանեն):',
    difficulty: 'միջին'
  },
  {
    id: 'f7',
    category: 'future',
    dialogue: [
      { speaker: 'Diego', text: 'Si tenemos tiempo libre mañana, ¿qué haremos?' },
      { speaker: 'Elena', text: 'Nosotros ___ una película interesante en el cine.' }
    ],
    maskedIndex: 1,
    blankWord: 'veremos',
    options: ['vemos', 'vimos', 'veremos', 'verán'],
    correctIndex: 2,
    translation: 'Դիեգո․ Եթե վաղը ազատ ժամանակ ունենանք, ի՞նչ կանենք։\nԵլենա․ Մենք կինոթատրոնում հետաքրքիր ֆիլմ կդիտենք։',
    explanation: 'Ապագա պայմանի դեպքում (Si...) գլխավոր նախադասությունում օգտագործվում է Futuro Simple՝ «veremos» (մենք կդիտենք):',
    difficulty: 'դժվար'
  },
  {
    id: 'f8',
    category: 'future',
    dialogue: [
      { speaker: 'Lucía', text: '¿Crees que los humanos ___ en Marte en el futuro?' },
      { speaker: 'Mateo', text: 'Sí, seguro que la tecnología avanzará mucho.' }
    ],
    maskedIndex: 0,
    blankWord: 'vivirán',
    options: ['viven', 'vivieron', 'vivían', 'vivirán'],
    correctIndex: 3,
    translation: 'Լուսիա․ Կարծո՞ւմ ես՝ ապագայում մարդիկ կապրեն Մարսի վրա։\nՄատեո․ Այո, համոզված եմ, որ տեխնոլոգիաները շատ առաջ կգնան։',
    explanation: 'Ապագային վերաբերող կանխատեսումների համար (en el futuro) օգտագործվում է Futuro Simple (`vivirán` - նրանք կապրեն):',
    difficulty: 'դժվար'
  }
];

export interface Player {
  name: string;
  avatar: string; // emoji or string literal
  points: number;
  stars: number;
  coins: number;
  streak: number; // consecutive correct answers
  unlockedLevels: string[]; // List of unlocked theme titles or achievements
}

export const AVATARS = [
  { char: '🧑‍🚀', name: 'Տիեզերագնաց' },
  { char: '🕵️', name: 'Խուզարկու' },
  { char: '⚽', name: 'Ֆուտբոլիստ' },
  { char: '🎸', name: 'Կիթառահար' },
  { char: '🎨', name: 'Նկարիչ' },
  { char: '🎒', name: 'Ճանապարհորդ' },
  { char: '🧙', name: 'Կախարդ' },
  { char: '🦄', name: 'Միաեղջյուր' }
];

export interface GameState {
  players: [Player, Player];
  currentPlayerIndex: 0 | 1;
  selectedCategory: CategoryId | null;
  currentQuestionIndex: number; // relative to category
  showingResults: boolean;
  gameStarted: boolean;
  answeredThisTurn: boolean; // has answered the current question
  attemptsThisTurn: number; // how many tries for this question
  selectedOptionIndex: number | null; // currently highlighted option
  incorrectOptionsPicked: number[]; // indices of options that were incorrect and disabled
  starredAnimation: boolean; // trigger visual animation
  showGiftModal: boolean; // streak reward modal
  latestRewardMessage: string | null;
}
