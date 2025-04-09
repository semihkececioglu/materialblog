const posts = [
  {
    id: 1,
    title: "React Nedir?",
    summary:
      "React, kullanıcı arayüzleri oluşturmak için kullanılan bir JavaScript kütüphanesidir.",
    content: `
<img src="https://plus.unsplash.com/premium_photo-1701534008693-0eee0632d47a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2Vic2l0ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D" alt="Örnek görsel" style="max-width:100%; border-radius:8px; margin: 16px 0;" />

<h2>Deneme</h2>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi semper nunc id pellentesque volutpat. Praesent imperdiet eleifend ipsum eu iaculis. Aenean vel dolor sit amet leo elementum auctor. Curabitur a sollicitudin sapien, eu dapibus mauris. Nam ipsum ipsum, cursus id vehicula tristique, posuere vel turpis. Praesent efficitur, lectus in ornare lobortis, ante leo eleifend neque, at tempus libero mauris eu dolor. Cras mattis lacinia aliquet. Nam quis nisl a sapien hendrerit lobortis et sit amet nunc. Sed laoreet tellus fringilla urna rutrum, ac feugiat risus posuere. Nunc scelerisque consequat ex, id dictum ipsum. Donec id pulvinar diam, a congue erat. Suspendisse rutrum tortor metus, a sagittis quam bibendum eu. Nam elementum velit non elit placerat, fringilla convallis ligula consectetur. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut non diam tristique, tempus leo in, ultricies augue. Cras ultricies sollicitudin metus in consequat. Suspendisse gravida urna vitae sapien tristique laoreet. Curabitur consequat, velit quis dignissim condimentum, eros est dignissim lorem, id posuere nisl sapien ac leo. Duis fermentum sem vitae mauris interdum, sodales ultrices lorem pellentesque. Mauris a enim ante. In sed massa vel nulla posuere dignissim sed vitae purus. Mauris accumsan mi ipsum, quis faucibus tellus efficitur et. In imperdiet nunc sit amet aliquam consectetur. Curabitur egestas mi libero, ac ultrices massa auctor varius. Aenean commodo non lectus ac aliquet. Vestibulum nec egestas lectus. Sed eget urna a massa imperdiet ultrices. Curabitur nec purus et risus luctus malesuada. In et egestas augue. Maecenas eu ullamcorper mi, eu congue arcu. Ut feugiat vulputate pellentesque. Nam rhoncus felis libero, et viverra dui faucibus quis. Interdum et malesuada fames ac ante ipsum primis in faucibus. In hendrerit nisl et consectetur pharetra. Ut in malesuada diam, nec euismod erat. Curabitur congue hendrerit eros quis euismod. Sed turpis libero, blandit at ligula in, consequat semper elit. Fusce laoreet ut arcu ac mollis.In nec est est. In vel tristique massa, nec hendrerit ipsum. Mauris id vulputate magna. 

<h3>sad</h3>

Aliquam at eros ac metus ornare sagittis. Sed volutpat dolor a nulla egestas sollicitudin. Pellentesque et pharetra odio. Cras pulvinar, quam at vulputate tempor, magna tellus tempus nibh, vel rhoncus nunc massa eget risus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec et sollicitudin nunc, quis dictum urna. In sollicitudin luctus neque, sit amet vestibulum nibh molestie vitae. Integer interdum, mauris a porta gravida, lectus nibh pretium nunc, et luctus neque lorem ut tellus. Integer at consectetur justo. Aenean consectetur nibh ac ornare feugiat.Nam fermentum quis elit vitae fermentum. Suspendisse placerat consequat tortor, sit amet accumsan quam imperdiet non. Donec consectetur fermentum mollis. Donec diam odio, luctus at sapien nec, tristique feugiat tellus. Donec magna magna, sollicitudin ac arcu imperdiet, aliquet vulputate ante. Proin lacinia vitae nisi at ornare. Pellentesque in tempor lectus. In blandit posuere orci quis tincidunt.Phasellus a risus non mi hendrerit auctor. Fusce non convallis nisi, sed pulvinar arcu. Donec elementum vestibulum laoreet. Nunc libero velit, efficitur sit amet vulputate eu, ultricies at purus. Donec mauris quam, elementum sed auctor nec, ultrices quis nisl. Maecenas sagittis pulvinar tellus, in finibus risus porta et. Praesent sollicitudin id eros ut elementum. Sed fermentum dapibus quam, nec malesuada diam mollis et. Integer viverra, diam at sagittis placerat, nisi enim rhoncus mauris, vel fermentum mauris lectus vitae tortor. Sed tincidunt lacus et lorem maximus placerat. Nullam condimentum erat eget pretium facilisis. Praesent nec vestibulum leo.Pellentesque orci ipsum, congue eu mauris ultricies, dapibus rhoncus tellus. Nullam tincidunt consectetur odio, id maximus libero ultrices id. In ac ante risus. Nullam congue nunc sit amet ante eleifend, ac vulputate elit ornare. Aliquam in dignissim enim. Donec accumsan dictum viverra. Aenean maximus neque ac risus tincidunt sagittis. Nulla rhoncus ante sit amet ante tristique hendrerit. Nulla facilisi. Morbi posuere, ligula sit amet porta viverra, velit est hendrerit tortor, ut hendrerit dui mauris id dui. Aliquam erat volutpat. Proin bibendum ut nulla eget dignissim. In vitae ipsum commodo diam convallis feugiat. Fusce ultricies volutpat ligula sit amet sagittis. Curabitur venenatis nisi justo, non tincidunt metus consequat ac. Sed justo urna, ullamcorper at erat vitae, interdum luctus purus.Nullam ac cursus urna. Nulla facilisi. Curabitur vitae massa felis. Pellentesque vulputate blandit augue ac venenatis. Etiam sit amet venenatis nibh, vel condimentum ante. Cras sed odio lacus. Praesent nec velit felis. Quisque blandit nulla quis rutrum imperdiet. Quisque eu augue feugiat, ornare justo eu, feugiat elit. Aenean et diam sed ligula molestie malesuada. Nulla dapibus turpis molestie interdum iaculis. Donec lacinia egestas imperdiet. Nulla at arcu velit.Donec eget sollicitudin arcu. Mauris volutpat, diam nec varius ultrices, turpis quam fermentum sem, ut varius dui quam eu turpis. Sed quis efficitur elit, sed dapibus velit. Mauris libero justo, viverra at ipsum quis, ullamcorper feugiat nibh. Maecenas a tempor augue. Ut consectetur odio nisi, id commodo elit aliquet eu. Donec vitae luctus nisl. Nunc pharetra pulvinar ligula vitae finibus.
`,
    category: "React",
    tags: ["react", "material-ui", "blog"],
  },
  {
    id: 2,
    title: "Material UI ile Arayüz",
    summary: "Material UI, Google Material Design sistemini temel alır.",
    content: "Material UI, bileşen odaklı bir UI framework'tür...",
    category: "Tasarım",
    tags: ["react", "material-ui", "blog"],
  },
  {
    id: 3,
    title: "React Router Kullanımı",
    summary: "SPA yapılarında yönlendirme sağlayan bir pakettir.",
    content: "React Router sayesinde tek sayfalı uygulamalarda...",
    category: "React",
    tags: ["react", "material-ui", "blog"],
  },
  {
    id: 4,
    title: "JavaScript Temelleri",
    summary: "Bu yazıda JS’in temel yapılarını inceliyoruz.",
    content: "Değişkenler, fonksiyonlar, döngüler ve daha fazlası...",
    category: "JavaScript",
    tags: ["react", "material-ui", "blog"],
  },
  {
    id: 5,
    title: "JavaScript Temelleri",
    summary: "Bu yazıda JS’in temel yapılarını inceliyoruz.",
    content: "Değişkenler, fonksiyonlar, döngüler ve daha fazlası...",
    category: "JavaScript",
    tags: ["react", "material-ui", "blog"],
  },
  {
    id: 6,
    title: "JavaScript Temelleri",
    summary: "Bu yazıda JS’in temel yapılarını inceliyoruz.",
    content: "Değişkenler, fonksiyonlar, döngüler ve daha fazlası...",
    category: "JavaScript",
    tags: ["react", "material-ui", "blog"],
  },
  {
    id: 7,
    title: "JavaScript Temelleri",
    summary: "Bu yazıda JS’in temel yapılarını inceliyoruz.",
    content: "Değişkenler, fonksiyonlar, döngüler ve daha fazlası...",
    category: "JavaScript",
    tags: ["react", "material-ui", "blog"],
  },
  {
    id: 8,
    title: "JavaScript Temelleri",
    summary: "Bu yazıda JS’in temel yapılarını inceliyoruz.",
    content: "Değişkenler, fonksiyonlar, döngüler ve daha fazlası...",
    category: "JavaScript",
    tags: ["react", "material-ui", "blog"],
  },
  {
    id: 9,
    title: "JavaScript Temelleri",
    summary: "Bu yazıda JS’in temel yapılarını inceliyoruz.",
    content: "Değişkenler, fonksiyonlar, döngüler ve daha fazlası...",
    category: "JavaScript",
    tags: ["react", "material-ui", "blog"],
  },
  {
    id: 10,
    title: "JavaScript Temelleri",
    summary: "Bu yazıda JS’in temel yapılarını inceliyoruz.",
    content: "Değişkenler, fonksiyonlar, döngüler ve daha fazlası...",
    category: "JavaScript",
    tags: ["react", "material-ui", "blog"],
  },
];

export default posts;
