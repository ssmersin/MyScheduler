﻿var ptsLocaleTr = {
    AssignedPersonToTask: 'Göreve Tanımlı',
    CalTypePerson: 'Kişiler Takvimi',
    CalTypeTask: 'Birimler Takvimi',
    CalFirstColHeader: [{ person: 'İsimler', task: 'Birimler'}],
    Close: 'Kapat',
    CreateTask: 'Yeni Görev Oluştur',
    CreateTaskMessage:'Eğer devam ederseniz bugün tarihli bir görev oluşturulacaktır. Tüm diğer bilgileri bir sonraki ekranda güncelleyebileceksiniz. Bu ekrandan sonra iptal etmek isterseniz oluşturulan yeni görevi siliniz.',
    DateCalendarView: 'Günlük Görünüm',
    day: 'Gün',
    days: 'Günler',
    DeleteTaskSubTitle: 'Alt Görev Sil',
    DeleteTaskSubMessage: 'Eğer bu alt görevi silerseniz.atanmış kişi bilgileri silinecektir.Lütfen silme talebinizi onaylayınız.',
    DeleteTaskMessage: 'Eğer <b>YYY</b> görevini silerseniz, bu görev ile alakalı tüm alt görev bilgileri ve atanmış kişi bilgileri silinecektir.Lütfen silme talebinizi onaylayınız.',
    DeleteLastTaskSubMessage: 'Bu  <b>YYY</b> için son alt görevdir. Bu alt görevi silerseniz <b>YYY</b> ana görev de silinecektir. Lütfen silme talebinizi onaylayınız.',
    DefaultTaskType: 'Başlangıç Görev Türü',
    DefaultTaskDesc: 'Bu açıklama gmrev için otomatik oluşturulmuştur.',
    DefaultSubTaskDesc: 'Bu açıklama alt görev için otomatik olarak oluşturulmuştur.',
    erase: 'Sil',
    FilterTitle:'Filitreler',
    InsufficientInfoTitle: 'Yetersiz Bilgi',
    InsufficientInfoSUB: 'Görev zamanı için geçerli başlangı. ve bitiş zamanı girmelisiniz.',
    JobFilterTitle:'Görev Filitreleri',
    keep: 'Sakla',
    MonthCalendarView: 'Aylık Görünüm',
    months: 'Aylar',
    NowColor: 'Şimdi Rengi',
    on: 'Açık',
    off: 'Kapalı',
    PersonsCanbeAddLater: 'Kaydedilmemiş göreve kişi atayamazsınız. Lütfen önce kaydedp daha sonra kişi atamayınız.',
    personJobTitle: 'Görevi',
    personalInfoTitle: 'Kişisel Bilgiler',
    Private:'Kişisel',
    remove:'Sil',
    removePersonFRTaskTitle: 'Görevden Kişileri Silme',
    removepersondescription: 'Eğer onaylarsanız <b>YYY</b> görevden silinecektir.',
    removelastpersondescription: '<b>YYY</b> görevdeki son kişi. Lütfen sadece YYY veya hem YYY hemde görevi silmek için karar veriniz.',
    removepersononly: 'Sadece Kişiyi Sil',
    removepersonanddeletetask: 'Kişiyi ve görevi sil',
    Save:'Kaydet',
    SelectDateText: 'Gün Seçiniz',
    SelectTypeForTask: 'Görev Türü Seçiniz',
    SelectGroupForTask: 'Görev İçin Birim Seçiniz',
    settingsTitle: 'Ayarlar',
    SelectLanguageTitle: 'Dil Seçiniz',
    showGroupsTitle: 'Gruplandır',
    showInfoBoxTitle: 'Fare ile bilgi kutusu aç',
    SelectedColor: 'Seçili Tarih Rengi',
    SelectToAddTitle: 'Eklemek İçin Seçiniz',
    SelectPerson:'Bir Kişi Seçin',
    SpecialDayColor: 'Dini/Milli Günler',
    TaskBegin: 'Başlangıç',
    TaskEnd: 'Bitiş',
    TaskDescription: 'Görev Açıklaması',
    TaskType: 'Görev Türü',
    TaskID: 'Görev ID',
    TaskGroup:'Birim',
    TaskTimes: 'Görev Periyodu',
    TaskPersons: 'Görevliler',
    TaskSubDesc:'Açıklama',
    WeekCalendarView: 'Haftalık Görünüm',
    WeekendColor: 'Haftasonu Rengi',
    YearCalendarView: 'Yıllık Görünüm'
   
};

if (i18n != undefined) {
    i18n.tr = ptsLocaleTr;
    i18n.allowed.push('tr');
} else {
    var i18n = {
        allowed: ['tr'],
        tr: ptsLocaleTr
    };
}
