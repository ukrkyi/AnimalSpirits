from django.shortcuts import render


# Create your views here.
def index(request):
    return render(request, 'animalSpirits/index.html')


def about(request):
    return render(request, 'animalSpirits/about.html')


def aboutUs(request):
    return render(request, 'animalSpirits/aboutUs.html')


def rules(request):
    return render(request, 'animalSpirits/rules.html')


def timer(request):
    return render(request, 'animalSpirits/timer.html')


def evaluate(request):
    return render(request, 'animalSpirits/evaluate.html')
